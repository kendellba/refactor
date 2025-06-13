import { postFormData } from '@/shared/services/api'; // Use the postFormData helper

const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

/**
 * Submits the address data to the backend.
 * @param {FormData} addressFormData - The FormData object containing address details and files.
 * @returns {Promise<object>} The response from the API.
 */
export const submitAddress = async (addressFormData) => {
  console.log('submitAddress called at:', new Date().toISOString());
  
  // Log FormData contents
  console.log('FormData contents:');
  for (let [key, value] of addressFormData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  
  try {
    const response = await postFormData('/addresses/', addressFormData, {
      timeout: API_TIMEOUT,
    });
    console.log('Success:', response);
    return response;
  } catch (error) {
    console.error('API Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    
    if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
      console.error('Validation Errors:');
      error.response.data.detail.forEach((err, i) => {
        console.error(`${i + 1}. Field: ${err.loc?.join('.')}, Message: ${err.msg}, Type: ${err.type}`);
      });
    }
    
    throw error;
  }
}; 