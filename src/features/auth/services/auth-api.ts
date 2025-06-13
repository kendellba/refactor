import { post } from '@/shared/services/api'; // Updated import to use the new API service
import type { LoginResponse } from '@/types/auth';

const LOGIN_ENDPOINT = '/auth/login'; // Placeholder: Adjust if different

/**
 * Logs in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response from the API, expected to include token and user info.
 * @throws {Error} If the API call fails.
 */
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // The original apiService.login might have a specific structure it expects or returns.
    // We are replicating a common pattern here.
    const response = await post(LOGIN_ENDPOINT, { email, password });
    return response.data as LoginResponse; // Expecting response.data to be { token, user, signup_id, ... } or similar
  } catch (error: any) {
    // Log detailed error information if available from the response
    console.error(
      'Error in loginUser service:',
      error.response?.data || error.message
    );
    // Re-throw the error so it can be caught and handled by the calling action in the store
    throw error;
  }
}; 