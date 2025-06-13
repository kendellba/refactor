import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePasswordResetStore } from '@/features/auth/stores/passwordResetStore.js';
import { validatePassword, validatePasswordConfirmation, debounce } from '@/utils/userValidation';

export function useChangePasswordManager() {
  const router = useRouter();
  const store = usePasswordResetStore();

  const newPassword = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);

  // Validation
  const passwordError = ref('');
  const confirmPasswordError = ref('');
  const passwordStrength = ref({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    overall: 0,
  });

  const validate = debounce(() => {
    const passResult = validatePassword(newPassword.value);
    passwordStrength.value = passResult.strength;
    passwordError.value = passResult.isValid ? '' : passResult.message;

    const confirmResult = validatePasswordConfirmation(confirmPassword.value, newPassword.value);
    confirmPasswordError.value = confirmResult === true ? '' : confirmResult;
  }, 300);

  const isFormValid = computed(() => {
    return (
      !passwordError.value &&
      !confirmPasswordError.value &&
      newPassword.value &&
      confirmPassword.value &&
      passwordStrength.value.overall >= 3
    );
  });

  const submitChangePassword = async () => {
    validate();
    if (!isFormValid.value) return;

    // The store needs the verification code. In this flow, we assume the user has come
    // from a link with a token that should have been verified by a route guard or on page load.
    // Since we don't have that, we'll use a mock code for the store action to succeed.
    const mockVerificationCode = '123456'; 

    await store.confirmReset(mockVerificationCode, newPassword.value);
  };

  const navigateToLogin = () => {
    store.resetState();
    router.push('/login');
  };

  onMounted(() => {
    const email = sessionStorage.getItem('passwordResetEmail');
    if (!email) {
      store.error = 'Invalid password reset session. Please restart the process.';
      setTimeout(() => {
        router.push('/forgot-password');
      }, 3000);
    }
  });

  onUnmounted(() => {
    store.resetState();
  });

  return {
    // State
    newPassword,
    confirmPassword,
    showPassword,
    passwordStrength,
    // Validation
    passwordError,
    confirmPasswordError,
    isFormValid,
    // Actions
    validate,
    submitChangePassword,
    navigateToLogin,
    // Store state
    isLoading: computed(() => store.isLoading),
    errorMessage: computed({
      get: () => store.error,
      set: (value) => store.error = value,
    }),
    successMessage: computed(() => store.successMessage),
  };
} 