import { api } from '@/shared/services/api';

/**
 * Submits a single beneficiary's data.
 * @param {object} beneficiaryData - The beneficiary data object.
 *   Expected fields match the API payload structure, e.g.:
 *   - signup_id (string, from store)
 *   - first_name (string)
 *   - last_name (string)
 *   - middle_name (string|null)
 *   - address_line_1 (string)
 *   - address_line_2 (string|null)
 *   - city (string)
 *   - country (string)
 *   - dob (string, YYYY-MM-DD)
 *   - gender (string, e.g., 'male', 'female')
 *   - relationship_to_beneficiary (string)
 *   - id_number (string)
 *   - id_type (string)
 *   - percent_of_beneficiary_interest (number)
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API call fails.
 */
export const submitBeneficiary = async (beneficiaryData) => {
  try {
    // The component was using /beneficiaries/
      const response = await api.post('/beneficiaries/', beneficiaryData);
    return response;
  } catch (error) {
    console.error('Error in submitBeneficiary service:', error.response?.data || error.message);
    // Re-throw the error so the calling action in the Pinia store can handle it,
    // parse it, and update state (isLoading, apiSubmitError, apiFieldErrors) accordingly.
    throw error;
  }
}; 