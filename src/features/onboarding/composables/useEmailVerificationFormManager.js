import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { emailVerificationSchema } from '@/features/onboarding/schemas/email-verification-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore';
import {
  OPERATION_TYPE_SIGNUP,
  OPERATION_TYPE_LOGIN,
  OPERATION_TYPE_SIGN_IN,
  RESEND_CODE_COUNTDOWN_SECONDS,
  VERIFICATION_CODE_LENGTH
} from '@/features/onboarding/constants/email-verification-options.js';

const LOCAL_STORAGE_KEY = 'emailVerificationCode';

export function useEmailVerificationFormManager() {
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  // Initialize formData with default values
  const formData = ref({
    verificationCode: ''
  });

  // Use simple form validation directly
  const {
    errors: fieldErrors,
    serverError: formSubmitError,
    validate,
    clearErrors
  } = useSimpleFormValidation(emailVerificationSchema);

  // State management
  const isLoginVerification = ref(false);
  const countdown = ref(0);
  let countdownInterval = null;

  const userEmail = computed(() => demoStore.email || sessionStorage.getItem('verifyingEmail') || '');

  // --- Utility Functions ---
  const buildApiParams = (operation, includeCode = false) => {
    const params = { operation };
    
    if (isLoginVerification.value) {
      params.email = demoStore.email;
    } else {
      params.signupId = demoStore.signupId;
    }
    
    if (includeCode) {
      params.code = formData.value.verificationCode || '';
    }
    
    return params;
  };

  const getCurrentUserId = () => {
    return isLoginVerification.value ? demoStore.email : demoStore.signupId;
  };

  const clearCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    countdown.value = 0;
  };

  // --- Lifecycle and Persistence ---
  let initialStateForUnloadCheck = { code: '' };

  const loadState = () => {
    try {
      const savedCode = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCode) {
        formData.value.verificationCode = savedCode;
      }

      isLoginVerification.value = sessionStorage.getItem('verificationSource') === 'login';
      initialStateForUnloadCheck.code = formData.value.verificationCode;
    } catch (error) {
      console.error('FM: Error loading state:', error);
      formData.value.verificationCode = '';
      initialStateForUnloadCheck.code = '';
    }
  };

  const persistState = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, formData.value.verificationCode || '');
    } catch (error) {
      console.error('FM: Error persisting state:', error);
    }
  };

  const clearPersistedState = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      formData.value.verificationCode = '';
      initialStateForUnloadCheck.code = '';
    } catch (error) {
      console.error('FM: Error clearing state:', error);
    }
  };

  const hasUnsavedChanges = computed(() => {
    return (formData.value.verificationCode || '') !== initialStateForUnloadCheck.code;
  });

  const beforeUnloadHandler = (event) => {
    if (hasUnsavedChanges.value) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  };

  // Watch formData.verificationCode to update state and enforce length limit
  watch(() => formData.value.verificationCode, (newCode) => {
    if (newCode && newCode.length > VERIFICATION_CODE_LENGTH) {
      formData.value.verificationCode = newCode.slice(0, VERIFICATION_CODE_LENGTH);
    }
    initialStateForUnloadCheck.code = newCode || '';
  });

  // --- Countdown Logic ---
  const startResendCountdown = () => {
    clearCountdown();
    countdown.value = RESEND_CODE_COUNTDOWN_SECONDS;
    countdownInterval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        clearCountdown();
      }
    }, 1000);
  };

  // --- API Methods ---
  const requestNewVerificationCode = async () => {
    clearErrors();
    
    if (onboardingStore.isRequestingCode || countdown.value > 0) {
      return { success: false, generalMessage: 'Please wait before resending the code.' };
    }

    const currentId = getCurrentUserId();
    if (!currentId) {
      const error = 'Missing user identifier. Cannot request code.';
      formSubmitError.value = error;
      return { success: false, generalMessage: error };
    }

    const operation = isLoginVerification.value ? OPERATION_TYPE_LOGIN : OPERATION_TYPE_SIGNUP;
    const params = buildApiParams(operation);
    
    const result = await onboardingStore.requestEmailVerificationCodeAction(params);

    if (result.success) {
      startResendCountdown();
      formSubmitError.value = null;
    } else {
      formSubmitError.value = result.generalMessage || 'Failed to send verification code. Please try again.';
    }
    
    return result;
  };

  const submitVerificationCode = async () => {
    clearErrors();

    // Validate form
    const validationResult = await validate(formData.value);
    if (!validationResult.isValid) {
      if (!formSubmitError.value && Object.keys(fieldErrors.value).length > 0) {
        formSubmitError.value = 'Please correct the errors in the form.';
      }
      return { success: false, generalMessage: formSubmitError.value || 'Validation failed' };
    }

    const currentId = getCurrentUserId();
    if (!currentId) {
      const error = 'Missing user identifier. Cannot verify code.';
      formSubmitError.value = error;
      return { success: false, generalMessage: error };
    }

    const operation = isLoginVerification.value ? OPERATION_TYPE_SIGN_IN : OPERATION_TYPE_SIGNUP;
    const params = buildApiParams(operation, true);
    
    try {
      const result = await onboardingStore.verifyEmailCodeAction(params);

      if (result.success) {
        clearPersistedState();
        clearCountdown();
      } else {
        formSubmitError.value = result.generalMessage || 'Verification failed.';
        
        // Apply field-specific errors if provided
        if (result.fieldMessages?.verificationCode) {
          fieldErrors.value.verificationCode = result.fieldMessages.verificationCode;
        } else if (result.generalMessage?.toLowerCase().includes('code')) {
          fieldErrors.value.verificationCode = result.generalMessage;
        }
      }
      
      return result;
    } catch (error) {
      console.error('FM: API error during verification:', error);
      formSubmitError.value = 'An error occurred while verifying the code.';
      return { success: false, generalMessage: 'API error during verification.' };
    }
  };

  // --- Component Handler Methods ---
  const handleSubmit = async () => {
    const result = await submitVerificationCode();
    
    if (result.success) {
      return { success: true, shouldNavigate: true, route: '/email-verification-successful' };
    }
    
    return result;
  };

  const handleRequestNewCode = async () => {
    return await requestNewVerificationCode();
  };

  const navigateToPrevious = () => {
    return isLoginVerification.value 
      ? { shouldNavigate: true, route: '/login' }
      : { shouldNavigate: true, route: 'back' };
  };

  const validateField = async (fieldName) => {
    if (!formData.value || !fieldName) return;
    
    try {
      const fieldValue = formData.value[fieldName];
      const fieldSchema = emailVerificationSchema.shape[fieldName];
      
      if (fieldSchema) {
        const result = await fieldSchema.safeParseAsync(fieldValue);
        if (!result.success) {
          fieldErrors.value = {
            ...fieldErrors.value,
            [fieldName]: result.error.issues[0]?.message || 'Invalid value'
          };
        } else {
          const newErrors = { ...fieldErrors.value };
          delete newErrors[fieldName];
          fieldErrors.value = newErrors;
        }
      }
    } catch (error) {
      console.error('FM: Error validating field:', fieldName, error);
    }
  };

  const formatInput = () => {
    let cleanedCode = (formData.value.verificationCode || '').replace(/[^0-9]/g, '');
    if (cleanedCode.length > VERIFICATION_CODE_LENGTH) {
      cleanedCode = cleanedCode.slice(0, VERIFICATION_CODE_LENGTH);
    }
    formData.value.verificationCode = cleanedCode;
  };

  const getNavigationForError = () => {
    if (formSubmitError.value) {
      if (formSubmitError.value.includes('Missing registration details')) {
        return { shouldNavigate: true, route: '/basic-info' };
      }
      if (formSubmitError.value.includes('Authentication error')) {
        return { shouldNavigate: true, route: '/login' };
      }
    }
    return { shouldNavigate: false };
  };

  // --- Lifecycle ---
  onMounted(async () => {
    loadState();
    window.addEventListener('beforeunload', beforeUnloadHandler);

    // Validation checks for proper context
    if (!demoStore.signupId && !isLoginVerification.value) {
      formSubmitError.value = 'Missing registration details. Please start from basic information.';
      return;
    }

    if (isLoginVerification.value && !demoStore.email) {
      formSubmitError.value = 'Authentication error. Please log in again.';
      return;
    }

    // Request initial verification code if needed
    try {
      if (!formData.value.verificationCode) {
        const result = await requestNewVerificationCode();
        if (!result.success) {
          formSubmitError.value = result.generalMessage || 'Failed to send initial verification code.';
        }
      }
    } catch (error) {
      console.error('FM: Error in initialization:', error);
      formSubmitError.value = 'An error occurred while setting up email verification.';
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    clearCountdown();
    if (hasUnsavedChanges.value) {
      persistState();
    }
  });

  return {
    // Core form data and validation
    formData,
    fieldErrors,
    formSubmitError,
    validateField,
    clearErrors,
    
    // Main handlers
    handleSubmit,
    handleRequestNewCode,
    navigateToPrevious,
    getNavigationForError,
    
    // Utility functions
    formatInput,
    
    // State
    isLoginVerification,
    countdown,
    userEmail,
    isRequestingCode: computed(() => onboardingStore.isRequestingCode),
    isLoading: computed(() => onboardingStore.isLoading),
    
    // Persistence
    clearPersistedState,
    hasUnsavedChanges,
    startResendCountdown,
  };
}
