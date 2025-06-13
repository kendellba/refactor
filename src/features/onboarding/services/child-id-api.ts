import { postFormData } from '@/shared/services/api'; // Use the postFormData helper

/**
 * Submits a single ID document set (first or second ID) for a child.
 * @param {FormData} idFormData - The FormData object containing ID details and files.
 *   Expected FormData fields:
 *   - signup_id (string)
 *   - id_type (string)
 *   - holder_type (string, e.g., 'child')
 *   - id_number (string)
 *   - id_expiry_date (string, YYYY-MM-DD)
 *   - is_primary_id (string, 'true' or 'false')
 *   - id_files (File objects, can be multiple)
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API call fails.
 */
export const submitChildIdDocument = async (idFormData) => {
  try {
    // Log the FormData contents for debugging
    console.log('=== Child ID API Request Debug ===');
    console.log('FormData entries:');
    for (let [key, value] of idFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified
        });
      } else {
        console.log(`${key}:`, value, `(type: ${typeof value})`);
      }
    }
    console.log('=== End FormData Debug ===');

    // Use the postFormData helper which properly handles multipart/form-data
    const response = await postFormData('/identifications/', idFormData);
    console.log('Child ID API Response:', response);
    return response;
  } catch (error) {
    console.error('Error in submitChildIdDocument:', error.response?.data || error.message);
    // It's important that the error is re-thrown so the calling action in the store can handle it,
    // parse it, and update state (isLoading, apiSubmitError, apiFieldErrors) accordingly.
    throw error; 
  }
}; 