import { api } from '@/shared/services/api';
import { getBackendErrorMessage } from '@/utils/errorHandler';

/**
 * Verifies an existing member's account number.
 * @param {string} accountNumber - The account number to verify.
 * @param {string} signupId - The signup ID for the current onboarding session.
 * @returns {Promise<object>} - A promise that resolves to the API response.
 */
export const verifyAccountNumber = async (accountNumber, signupId) => {
  try {
    // The endpoint is hypothetical and should be replaced with the actual API endpoint.
    const response = await api.post('/onboarding/verify-account', {
      account_number: accountNumber,
      signup_id: signupId,
    });
    return response.data;
  } catch (error) {
    // Use the error handler to generate a user-friendly error message
    throw new Error(getBackendErrorMessage(error, "Failed to verify account number. Please try again."));
  }
};