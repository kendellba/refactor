import { api } from '@/shared/services/api';

const BASE_URL = '/device-verifications';

export const MobileVerificationApiService = {
  /**
   * Requests a new verification code to be sent.
   * @param {string} signupId - The signup ID.
   * @returns {Promise<object>} The API response.
   */
  sendVerificationCode: (signupId) => {
    return api.post(`${BASE_URL}/send/`, {
      identifier_type: 'mobile',
      operation: 'signup',
      signup_id: signupId,
    });
  },

  /**
   * Verifies the provided code.
   * @param {string} signupId - The signup ID.
   * @param {string} verificationCode - The verification code.
   * @returns {Promise<object>} The API response.
   */
  verifyCode: (signupId, verificationCode) => {
    return api.post(`${BASE_URL}/verify/`, {
      signup_id: signupId,
      identifier_type: 'mobile',
      operation: 'signup',
      code: verificationCode,
    });
  },
};
