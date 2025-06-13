import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { mobileVerificationSchema } from '@/features/onboarding/schemas/mobile-verification-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore';

const LOCAL_STORAGE_KEY = 'mobileVerificationCode';
const RESEND_CODE_COUNTDOWN_SECONDS = 60;
const VERIFICATION_CODE_LENGTH = 6;

// Mapping between API field names and form field names
const API_FIELD_MAPPING = {
  code: 'verificationCode',
  verification_code: 'verificationCode',
};

export function useMobileVerificationFormManager() {
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  // Initialize form data with default values
  const formData = ref({
    verificationCode: ''
  });

  // Use simple form validation
  const {
    errors: fieldErrors,
    serverError: formSubmitError,
    validate,
    clearErrors
  } = useSimpleFormValidation(mobileVerificationSchema);

  // State management
  const countdown = ref(0);
  const resendCount = ref(0);
  const maxResendAttempts = 3;
  let countdownInterval = null;

  // Computed properties
  const isResendDisabled = computed(() => {
    return countdown.value > 0 || resendCount.value >= maxResendAttempts;
  });

  // --- Utility Functions ---
  const clearCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    countdown.value = 0;
  };

  const startResendCountdown = () => {
    clearCountdown();
    countdown.value = RESEND_CODE_COUNTDOWN_SECONDS;
    resendCount.value++;

    countdownInterval = setInterval(() => {
      if (countdown.value > 0) {
      countdown.value--;
      } else {
        clearCountdown();
      }
    }, 1000);
  };

  // --- Error Handling ---
  const handleApiError = (error) => {
    
    const errorData = error.response?.data;
    let generalError = 'An unexpected error occurred.';
    const parsedFieldErrors: Record<string, string> = {};

    if (errorData) {
      // Handle different error response formats
      if (typeof errorData.detail === 'string') {
        generalError = errorData.detail;
        // Check if the error message is about the verification code
        if (generalError.toLowerCase().includes('code') || generalError.toLowerCase().includes('verification')) {
          parsedFieldErrors.verificationCode = generalError;
          generalError = ''; // Clear general error if it's a field error
        }
      } else if (Array.isArray(errorData.detail)) {
        // Handle validation errors array
        errorData.detail.forEach(err => {
          if (err.loc && err.loc.length > 1) {
            const apiFieldKey = err.loc[1];
            const formFieldKey = API_FIELD_MAPPING[apiFieldKey] || apiFieldKey;
            if (!parsedFieldErrors[formFieldKey]) {
              parsedFieldErrors[formFieldKey] = err.msg;
            }
          } else if (err.msg) {
            generalError = err.msg;
          }
        });
      } else if (errorData.message) {
        generalError = errorData.message;
      }
    } else if (error.message) {
      generalError = error.message;
    }

    // Handle specific status codes
    if (error.response) {
      switch (error.response.status) {
        case 400:
          if (!generalError) generalError = 'Invalid request. Please check your input.';
          break;
        case 401:
          generalError = 'Your session has expired. Please log in again.';
          break;
        case 403:
          generalError = 'You do not have permission to perform this action.';
          break;
        case 404:
          generalError = 'The requested resource was not found.';
          break;
        case 429:
          generalError = 'Too many attempts. Please try again later.';
          break;
        case 500:
          generalError = 'Server error. Please try again later.';
          break;
        default:
          if (!generalError) generalError = 'An unexpected error occurred.';
      }
    }

    return {
      generalError,
      fieldErrors: parsedFieldErrors
    };
  };

  // --- Lifecycle and Persistence ---
  let initialStateForUnloadCheck = { code: '' };

  const loadState = () => {
    try {
      const savedCode = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCode) {
        formData.value.verificationCode = savedCode;
      }
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

  // --- API Methods ---
  const requestNewVerificationCode = async () => {
    clearErrors("");
    
    if (onboardingStore.isSendingMobileCode || countdown.value > 0) {
      return { success: false, generalMessage: 'Please wait before resending the code.' };
    }

    if (!(demoStore as any).signupId) {
      const error = 'Missing signup ID. Cannot request code.';
      formSubmitError.value = error;
      return { success: false, generalMessage: error };
    }

    try {
      const result = await onboardingStore.sendMobileVerificationCodeAction();

      if (result.success) {
        startResendCountdown();
        formSubmitError.value = null;
      } else {
        const { generalError, fieldErrors: apiFieldErrors } = handleApiError(result.error);
        formSubmitError.value = generalError;
        Object.assign(fieldErrors.value, apiFieldErrors);
      }
      
      return result;
    } catch (error) {
      const { generalError, fieldErrors: apiFieldErrors } = handleApiError(error);
      formSubmitError.value = generalError;
      Object.assign(fieldErrors.value, apiFieldErrors);
      return { success: false, error, generalMessage: generalError };
    }
  };

  const submitVerificationCode = async () => {
    clearErrors("");

    // Validate form
    const validationResult = await validate(formData.value);
    if (!validationResult.isValid) {
      if (!formSubmitError.value && Object.keys(fieldErrors.value).length > 0) {
        formSubmitError.value = 'Please correct the errors in the form.';
      }
      return { success: false, generalMessage: formSubmitError.value || 'Validation failed' };
    }

    if (!(demoStore as any).signupId) {
      const error = 'Missing signup ID. Cannot verify code.';
      formSubmitError.value = error;
      return { success: false, generalMessage: error };
    }

    try {
      const result = await onboardingStore.verifyMobileCodeAction(formData.value.verificationCode);

      if (result.success) {
        clearPersistedState();
        clearCountdown();
      } else {
        const { generalError, fieldErrors: apiFieldErrors } = handleApiError(result.error);
        formSubmitError.value = generalError;
        Object.assign(fieldErrors.value, apiFieldErrors);
      }
      
      return result;
    } catch (error) {
      const { generalError, fieldErrors: apiFieldErrors } = handleApiError(error);
      formSubmitError.value = generalError;
      Object.assign(fieldErrors.value, apiFieldErrors);
      return { success: false, error, generalMessage: generalError };
    }
  };

  // --- Component Handler Methods ---
  const handleSubmit = async () => {
    const result = await submitVerificationCode();
    
    if (result.success) {
      return { success: true, shouldNavigate: true, route: '/mobile-verification-successful' };
    }
    
    return result;
  };

  const handleRequestNewCode = async () => {
    return await requestNewVerificationCode();
  };

  const navigateToPrevious = () => {
    return { shouldNavigate: true, route: 'back' };
  };

  const getNavigationForError = () => {
    if (formSubmitError.value) {
      if (formSubmitError.value.includes('Missing signup ID')) {
        return { shouldNavigate: true, route: '/signup' };
      }
      if (formSubmitError.value.includes('session has expired')) {
        return { shouldNavigate: true, route: '/login' };
      }
    }
    return { shouldNavigate: false };
  };

  const formatInput = () => {
    let cleanedCode = (formData.value.verificationCode || '').replace(/[^0-9]/g, '');
    if (cleanedCode.length > VERIFICATION_CODE_LENGTH) {
      cleanedCode = cleanedCode.slice(0, VERIFICATION_CODE_LENGTH);
    }
    formData.value.verificationCode = cleanedCode;
  };

  // --- Lifecycle ---
  onMounted(async () => {
    loadState();
    window.addEventListener('beforeunload', beforeUnloadHandler);

    if (!(demoStore as any).signupId) {
      formSubmitError.value = 'Missing signup ID. Please start from signup.';
      return;
    }

    try {
      if (!formData.value.verificationCode) {
        const result = await requestNewVerificationCode();
        if (!result.success) {
          const { generalError } = handleApiError(result.error);
          formSubmitError.value = generalError || 'Failed to send initial verification code.';
        }
      }
    } catch (error) {
      console.error('FM: Error in initialization:', error);
      const { generalError } = handleApiError(error);
      formSubmitError.value = generalError || 'An error occurred while setting up mobile verification.';
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
    validate,
    clearErrors,
    
    // Main handlers
    handleSubmit,
    handleRequestNewCode,
    navigateToPrevious,
    getNavigationForError,
    
    // Utility functions
    formatInput,
    
    // State
    countdown,
    resendCount,
    maxResendAttempts,
    isResendDisabled,
    isSendingCode: computed(() => onboardingStore.isSendingMobileCode),
    isLoading: computed(() => onboardingStore.isLoading),
    
    // Persistence
    clearPersistedState,
    hasUnsavedChanges,
  };
} 
