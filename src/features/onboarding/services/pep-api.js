import { api } from '@/shared/services/api';

/**
 * Submits the Politically Exposed Persons (PEP) data to the backend.
 * @param {object} pepData - The PEP data to submit.
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API request fails.
 */
export const submitPepData = async (pepData) => {
  try {
    // The actual endpoint is /peps, but the existing component uses /peps
    // The store action will prepare the full payload including signup_id
    const response = await api.post('/peps', pepData);
    return response.data;
  } catch (error) {
    console.error('Error submitting PEP data:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('API request failed');
  }
}; 