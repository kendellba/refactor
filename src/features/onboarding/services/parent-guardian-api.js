import { api } from '@/shared/services/api';

/**
 * Submits the parent or guardian's information.
 *
 * @param {FormData} formData - The form data containing the guardian's details and documents.
 * @returns {Promise<any>} The response from the API.
 */
export const submitParentGuardian = (formData) => {
  return api.post('/guardians/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}; 