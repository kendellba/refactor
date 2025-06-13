import { api } from '@/shared/services/api';

const SIGNUP_ENDPOINT = '/signups/';

/**
 * Submits the basic information (signup data).
 * @param {object} signupData - The signup data to be submitted.
 * @returns {Promise<object>} The response data from the API.
 * @throws {Error} If the API request fails.
 */
export const submitSignupData = async (signupData) => {
  try {
    // Using the centralized API service
    const response = await api.post(SIGNUP_ENDPOINT, signupData);
    return response;
  } catch (error) {
    console.error('Error submitting signup data via API service:', error);
    // Re-throw the error so it can be caught by the calling function (e.g., in the store action)
    // This allows the caller to access error.response for specific error handling.
    throw error;
  }
}; 