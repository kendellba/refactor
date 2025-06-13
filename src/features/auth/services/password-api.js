import { api } from '@/shared/services/api';

/**
 * Initiates the password reset process by sending a verification code.
 * In a real app, this would likely send an email or SMS.
 * @param {string} email - The user's email address.
 * @returns {Promise<object>}
 */
export const requestPasswordResetCode = async (email) => {
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
 * @param {string} email - The user's email address.
 * @returns {Promise<object>}
 */
export const resendPasswordResetCode = async (email) => {
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
 * @param {object} payload - The password reset data.
 * @param {string} payload.email - The user's email.
 * @param {string} payload.verificationCode - The verification code.
 * @param {string} payload.newPassword - The new password.
 * @returns {Promise<object>}
 */
export const completePasswordReset = async ({ email, verificationCode, newPassword }) => {
  try {
    // In a real implementation, you would post to your API endpoint.
    // const response = await api.post('/auth/reset-password', { email, verification_code: verificationCode, new_password: newPassword });
    // return response.data;

    // Mock implementation for demonstration
    console.log(`Completing password reset for ${email} with code ${verificationCode}`);
    if (verificationCode === '123456') { // Mock success code
        return { success: true, message: 'Password has been reset successfully.' };
    } else {
        // eslint-disable-next-line no-throw-literal
        throw { response: { data: { detail: 'Invalid verification code.' } } };
    }
  } catch (error) {
    const message = error.response?.data?.detail || 'An unexpected error occurred.';
    throw new Error(message);
  }
}; 