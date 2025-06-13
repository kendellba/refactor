import { api } from '@/shared/services/api';

const DEVICE_VERIFICATION_ENDPOINT = '/device-verifications';

export const requestEmailVerificationCode = async (identifier, operation, isEmail = false) => {
  try {
    const payload = {
      identifier_type: 'email',
      operation: operation,
    };
    
    // Add the appropriate identifier based on context
    if (isEmail) {
      payload.email = identifier;
    } else {
      payload.signup_id = identifier;
    }
    
    console.log('Sending verification code request with payload:', payload);
    
    const response = await api.post(`${DEVICE_VERIFICATION_ENDPOINT}/send/`, payload);
    console.log('API service received response:', response);
    return response; // Return response directly since interceptor already extracts .data
  } catch (error) {
    console.error('Error requesting email verification code:', error);
    throw error;
  }
};

export const verifyEmailCode = async (identifier, operation, code, isEmail = false) => {
  try {
    const payload = {
      identifier_type: 'email',
      operation: operation,
      code: code,
    };
    
    // Add the appropriate identifier based on context
    if (isEmail) {
      payload.email = identifier;
    } else {
      payload.signup_id = identifier;
    }
    
    console.log('Verifying email code with payload:', payload);
    
    const response = await api.post(`${DEVICE_VERIFICATION_ENDPOINT}/verify/`, payload);
    console.log('API service received verification response:', response);
    return response; // Return response directly since interceptor already extracts .data
  } catch (error) {
    console.error('Error verifying email code:', error);
    throw error;
  }
};

export const EmailVerificationApiService = {
  sendVerificationCode: requestEmailVerificationCode,
  verifyCode: verifyEmailCode,
}; 