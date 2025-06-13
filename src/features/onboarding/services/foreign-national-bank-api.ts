import { api } from '@/shared/services/api';

const FOREIGN_NATIONAL_BANK_ENDPOINT = '/foreign-nationals/';

/**
 * Submits foreign national bank information.
 * @param {object} bankData - The foreign national bank data.
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API call fails.
 */
export const submitForeignNationalBankInfo = async (bankData) => {
  try {
    const response = await api.post(FOREIGN_NATIONAL_BANK_ENDPOINT, bankData);
    return response;
  } catch (error) {
    // Log detailed error information if available from the response
    console.error(
      'Error in submitForeignNationalBankInfo service:',
      error.response?.data || error.message
    );
    // Re-throw the error so it can be caught and handled by the calling action in the store
    throw error;
  }
}; 