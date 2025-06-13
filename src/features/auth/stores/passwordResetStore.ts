import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import * as passwordApi from '@/features/auth/services/password-api.ts';
import type { PasswordResetResponse } from '@/types/auth';

export const usePasswordResetStore = defineStore('passwordReset', () => {
  const router = useRouter();

  // STATE
  const email: Ref<string> = ref('');
  const isCodeSent: Ref<boolean> = ref(false);
  const isLoading: Ref<boolean> = ref(false);
  const isResending: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  const successMessage: Ref<string | null> = ref(null);

  // ACTIONS
  const initiateReset = async (userEmail: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const response: PasswordResetResponse = await passwordApi.requestPasswordResetCode(userEmail);
      if (response.success) {
        email.value = userEmail;
        isCodeSent.value = true;
        successMessage.value = response.message;
        // In a real app, you might store a temporary token in sessionStorage
        sessionStorage.setItem('passwordResetEmail', userEmail);
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const resendCode = async (): Promise<void> => {
    if (!email.value) {
        const storedEmail = sessionStorage.getItem('passwordResetEmail');
        if (storedEmail) {
          email.value = storedEmail;
        }
    }
    if (!email.value) {
        error.value = "Email not found. Please start over.";
        return;
    }
    isResending.value = true;
    error.value = null;
    successMessage.value = null;
    try {
        const response: PasswordResetResponse = await passwordApi.resendPasswordResetCode(email.value);
        if(response.success) {
            successMessage.value = response.message;
        }
    } catch (err: any) {
        error.value = err.message;
    } finally {
        isResending.value = false;
    }
  };

  const confirmReset = async (verificationCode: string, newPassword: string): Promise<void> => {
    if (!email.value) {
        const storedEmail = sessionStorage.getItem('passwordResetEmail');
        if (storedEmail) {
          email.value = storedEmail;
        }
    }
     if (!email.value) {
        error.value = "Session expired. Please start over.";
        return;
    }
    isLoading.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const response: PasswordResetResponse = await passwordApi.completePasswordReset({
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
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const resetState = (): void => {
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
