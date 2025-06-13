import { api } from '@/shared/services/api';
import { getBackendErrorMessage } from '@/utils/errorHandler';

/**
 * Submits the final, consolidated onboarding data to create a user account.
 * This is a mock implementation and should be adapted to the real API endpoint and payload.
 * @param {object} onboardingData - The complete onboarding data from the demoStore.
 * @returns {Promise<object>} - A promise that resolves to the API response.
 */
export const createFinalAccount = async (onboardingData) => {
  try {
    // This endpoint and payload are hypothetical.
    // You would gather all the necessary data from the onboardingData object.
    const response = await api.post('/onboarding/finalize', {
      signup_id: onboardingData.signupId,
      // ... include all other relevant fields from onboardingData
      basic_info: onboardingData.basicInfo,
      address_info: onboardingData.addressInfo,
      // etc.
    });
    return response.data;
  } catch (error) {
    throw new Error(getBackendErrorMessage(error, "Failed to create the account."));
  }
}; 