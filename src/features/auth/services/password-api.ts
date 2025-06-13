import { api } from '@/shared/services/api';
import type { PasswordResetResponse, PasswordResetRequest } from '@/types/auth';

/**
 * Initiates the password reset process by sending a verification code.
 * In a real app, this would likely send an email or SMS.
 * @param email - The user's email address.
 * @returns Promise resolving to password reset response
 */
export const requestPasswordResetCode = async (email: string): Promise<PasswordResetResponse> => {
  // Mock implementation. Replace with your actual API call.
  console.log(`Requesting password reset code for ${email}`);
  // This simulates checking if the user exists and sending a code.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'A verification code has been sent.' });
    }, 1000);
  });
};

/**
 * Resends the verification code.
 * @param email - The user's email address.
 * @returns Promise resolving to password reset response
 */
export const resendPasswordResetCode = async (email: string): Promise<PasswordResetResponse> => {
  // Mock implementation.
  console.log(`Resending password reset code for ${email}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'A new verification code has been sent.' });
    }, 1000);
  });
};

/**
 * Completes the password reset process.
 * @param payload - The password reset data.
 * @returns Promise resolving to password reset response
 */
export const completePasswordReset = async (payload: PasswordResetRequest): Promise<PasswordResetResponse> => {
  try {
    // In a real implementation, you would post to your API endpoint.
    // const response = await api.post('/auth/reset-password', { email, verification_code: verificationCode, new_password: newPassword });
    // return response.data;

    // Mock implementation for demonstration
    console.log(`Completing password reset for ${payload.email} with code ${payload.verificationCode}`);
    if (payload.verificationCode === '123456') { // Mock success code
        return { success: true, message: 'Password has been reset successfully.' };
    } else {
        // eslint-disable-next-line no-throw-literal
        throw { response: { data: { detail: 'Invalid verification code.' } } };
    }
  } catch (error: any) {
    const message = error.response?.data?.detail || 'An unexpected error occurred.';
    throw new Error(message);
  }
}; 