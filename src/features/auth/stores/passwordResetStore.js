import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as passwordApi from '@/features/auth/services/password-api.js';

export const usePasswordResetStore = defineStore('passwordReset', () => {
  const router = useRouter();

  // STATE
  const email = ref('');
  const isCodeSent = ref(false);
  const isLoading = ref(false);
  const isResending = ref(false);
  const error = ref(null);
  const successMessage = ref(null);

  // ACTIONS
  const initiateReset = async (userEmail) => {
    isLoading.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const response = await passwordApi.requestPasswordResetCode(userEmail);
      if (response.success) {
        email.value = userEmail;
        isCodeSent.value = true;
        successMessage.value = response.message;
        // In a real app, you might store a temporary token in sessionStorage
        sessionStorage.setItem('passwordResetEmail', userEmail);
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const resendCode = async () => {
    if (!email.value) {
        email.value = sessionStorage.getItem('passwordResetEmail');
    }
    if (!email.value) {
        error.value = "Email not found. Please start over.";
        return;
    }
    isResending.value = true;
    error.value = null;
    successMessage.value = null;
    try {
        const response = await passwordApi.resendPasswordResetCode(email.value);
        if(response.success) {
            successMessage.value = response.message;
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        isResending.value = false;
    }
  };

  const confirmReset = async (verificationCode, newPassword) => {
    if (!email.value) {
        email.value = sessionStorage.getItem('passwordResetEmail');
    }
     if (!email.value) {
        error.value = "Session expired. Please start over.";
        return;
    }
    isLoading.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const response = await passwordApi.completePasswordReset({
        email: email.value,
        verificationCode,
        newPassword,
      });
      if (response.success) {
        successMessage.value = response.message;
        // Cleanup
        sessionStorage.removeItem('passwordResetEmail');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const resetState = () => {
    email.value = '';
    isCodeSent.value = false;
    isLoading.value = false;
    isResending.value = false;
    error.value = null;
    successMessage.value = null;
    sessionStorage.removeItem('passwordResetEmail');
  };

  return {
    // State
    email,
    isCodeSent,
    isLoading,
    isResending,
    error,
    successMessage,
    // Actions
    initiateReset,
    confirmReset,
    resendCode,
    resetState
  };
}); 