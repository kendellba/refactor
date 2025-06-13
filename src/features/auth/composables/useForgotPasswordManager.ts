import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePasswordResetStore } from '@/features/auth/stores/passwordResetStore.js';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '@/utils/userValidation';

export function useForgotPasswordManager() {
  const router = useRouter();
  const store = usePasswordResetStore();

  const emailField = ref('');
  const verificationCode = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);

  // Validation errors
  const emailError = ref('');
  const passwordError = ref('');
  const confirmPasswordError = ref('');

  // --- VALIDATION ---
  const validateStep1 = () => {
    const result = validateEmail(emailField.value);
    emailError.value = (result as any).isValid ? '' : (result as any).error;
    return (result as any).isValid;
  };

  const validateStep2 = () => {
    const passResult = validatePassword(newPassword.value);
    passwordError.value = passResult.isValid ? '' : (passResult as any).message;

    const confirmResult = validatePasswordConfirmation(confirmPassword.value, newPassword.value);
    confirmPasswordError.value = (confirmResult as any).isValid ? '' : (confirmResult as any).error;

    return passResult.isValid && (confirmResult as any).isValid && verificationCode.value.length === 6;
  };


  // --- ACTIONS ---
  const submitEmail = async () => {
    if (!validateStep1()) return;
    await store.initiateReset(emailField.value);
  };

  const submitNewPassword = async () => {
    if (!validateStep2()) {
        if(verificationCode.value.length !== 6) {
            store.error = 'Verification code must be 6 digits.';
        }
        return;
    }
    await store.confirmReset(verificationCode.value, newPassword.value);
  };
  
  const handleResendCode = () => {
      store.resendCode();
  };

  const navigateToLogin = () => {
    store.resetState();
    router.push('/login');
  };
  
  // Cleanup when component is unmounted
  onUnmounted(() => {
    store.resetState();
  });

  return {
    // State
    emailField,
    verificationCode,
    newPassword,
    confirmPassword,
    showPassword,
    // Validation
    emailError,
    passwordError,
    confirmPasswordError,
    // Methods
    validateStep1,
    validateStep2,
    submitEmail,
    submitNewPassword,
    handleResendCode,
    navigateToLogin,
    // Computed from store
    isCodeSent: computed(() => store.isCodeSent),
    isLoading: computed(() => store.isLoading),
    isResending: computed(() => store.isResending),
    errorMessage: computed({
      get: () => store.error,
      set: (value) => store.error = value,
    }),
    successMessage: computed(() => store.successMessage),
  };
} 

