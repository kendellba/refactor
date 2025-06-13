import { api } from '@/shared/services/api';

const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
const ADDRESSES_ENDPOINT = '/addresses/';

/**
 * Submits the mailing address data to the backend.
 * @param {FormData} mailingAddressFormData - The FormData object containing mailing address details and files.
 *                                            It's expected to include 'address_type': 'mailing'.
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API call fails.
 */
export const submitMailingAddress = async (mailingAddressFormData) => {
  // Ensure address_type is set to mailing if not already on the FormData by the caller
  if (!mailingAddressFormData.has('address_type')) {
    mailingAddressFormData.append('address_type', 'mailing');
  }
  // The original component set dwelling_status to 'null' for mailing.
  // If it needs to be explicitly set on FormData, the caller (store/composable) should do it.
  // Example: if (!mailingAddressFormData.has('dwelling_status')) {
  // mailingAddressFormData.append('dwelling_status', 'null');
  // }

  try {
    const response = await api.post(ADDRESSES_ENDPOINT, mailingAddressFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: API_TIMEOUT,
    });
    return response.data;
  } catch (error) {
    console.error('Error in submitMailingAddress service:', error.response?.data || error.message);
    throw error;
  }
}; 