import { postFormData } from '@/shared/services/api';

const EMPLOYMENT_ENDPOINT = '/employments/';

/**
 * Submits employment information, including file uploads.
 * @param {FormData} employmentFormData - The employment data as a FormData object.
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API call fails.
 */
export const submitEmploymentInformation = async (employmentFormData) => {
  try {
    // Use the dedicated postFormData method for FormData uploads
    const response = await postFormData(EMPLOYMENT_ENDPOINT, employmentFormData);
    return response;
  } catch (error) {
    console.error('Error in submitEmploymentInformation service:', error.response?.data || error.message);
    if (error.response?.data?.detail) {
      console.error('Detailed validation errors:', JSON.stringify(error.response.data.detail, null, 2));
    }
    throw error; // Re-throw for the store to handle
  }
}; 