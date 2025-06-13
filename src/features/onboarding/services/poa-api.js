import { api } from '@/shared/services/api';

const BASE_URL = '/power-of-attorneys';
const FILES_URL = '/power-of-attorney-files';

/**
 * Upload Power of Attorney files to the dedicated file upload endpoint
 * @param {FormData} filesFormData - FormData containing only the files
 * @returns {Promise<object>} The response from the file upload API
 * @throws {Error} If the file upload fails
 */
export const uploadPowerOfAttorneyFiles = async (filesFormData) => {
  try {
    const response = await api.post(`${FILES_URL}/`, filesFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    return response;
  } catch (error) {
    console.error('Error uploading Power of Attorney files:', error.response?.data || error);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw {
      detail: [{
        loc: ['body'],
        msg: error.message || 'Failed to upload Power of Attorney files',
        type: 'value_error'
      }]
    };
  }
};

/**
 * Submits the Power of Attorney (POA) data to the backend.
 * The poaPayload is expected to be a FormData object because it includes file uploads.
 * @param {FormData} poaFormData - The Power of Attorney data (as FormData).
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API request fails.
 */
export const submitPowerOfAttorneyData = async (poaFormData) => {
  try {
    // Validate required files before making the request
    const powerOfAttorneyFiles = poaFormData.getAll('power_of_attorney_files');
    if (!powerOfAttorneyFiles || powerOfAttorneyFiles.length === 0) {
      throw {
        detail: [{
          loc: ['body', 'power_of_attorney_files'],
          msg: 'At least one power of attorney document is required',
          type: 'value_error.missing'
        }]
      };
    }

    const response = await api.post(`${BASE_URL}/`, poaFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    return response;
  } catch (error) {
    console.error('Error submitting Power of Attorney data:', error.response?.data || error);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    if (error.detail) {
      throw error;
    }
    
    throw {
      detail: [{
        loc: ['body'],
        msg: error.message || 'Failed to submit Power of Attorney data',
        type: 'value_error'
      }]
    };
  }
}; 