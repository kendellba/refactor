import { API_FIELD_MAPPINGS } from '@/features/onboarding/constants/api-field-mappings';

/**
 * Handles API errors and returns standardized error response
 * @param {Error} error - The error object from the API call
 * @param {string} context - The context of the error (e.g., 'PEP', 'Membership', etc.)
 * @param {Object} fieldMapping - Optional field mapping for the specific form
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error, context, fieldMapping = {}) => {
  const errorData = error.response?.data;
  let generalError = `An unexpected error occurred during ${context} submission.`;
  const parsedFieldErrors = {};

  if (errorData) {
    // Handle string error message
    if (typeof errorData.detail === 'string') {
      generalError = errorData.detail;
    }
    // Handle array of validation errors
    else if (Array.isArray(errorData.detail)) {
      let tempGeneralError = '';
      errorData.detail.forEach(err => {
        if (err.loc && err.loc.length > 1) {
          const apiFieldKey = err.loc[1];
          const formFieldKey = fieldMapping[apiFieldKey] || apiFieldKey;
          if (!parsedFieldErrors[formFieldKey]) {
            parsedFieldErrors[formFieldKey] = err.msg;
          }
        } else if (err.msg) {
          tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
        }
      });
      if (tempGeneralError && !Object.keys(parsedFieldErrors).length) {
        generalError = tempGeneralError;
      }
    }
    // Handle object with error message
    else if (typeof errorData.detail === 'object' && errorData.detail.message) {
      generalError = errorData.detail.message;
    }
    // Handle non-200 status codes with custom messages
    else if (error.response?.status !== 200) {
      generalError = getStatusSpecificMessage(error.response?.status, context, errorData.message);
    }
  } else if (error.message) {
    generalError = error.message;
  }

  return {
    success: false,
    error: error,
    generalMessage: generalError,
    fieldMessages: parsedFieldErrors,
  };
};

/**
 * Get status-specific error message
 * @param {number} status - HTTP status code
 * @param {string} context - The context of the error
 * @param {string} defaultMessage - Default message from API
 * @returns {string} Status-specific error message
 */
const getStatusSpecificMessage = (status, context, defaultMessage) => {
  const contextLower = context.toLowerCase();
  
  switch (status) {
    case 400:
      return defaultMessage || `Invalid ${contextLower} data. Please check your input.`;
    case 401:
      return 'Your session has expired. Please restart the application process.';
    case 403:
      return `You do not have permission to submit ${contextLower} information.`;
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return `${context} information already exists for this signup.`;
    case 422:
      return `The provided ${contextLower} data is invalid. Please check your input.`;
    case 500:
      return 'An internal server error occurred. Please try again later.';
    default:
      return defaultMessage || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Validates if the signup ID exists
 * @param {string} signupId - The signup ID to validate
 * @returns {Object} Validation result
 */
export const validateSignupId = (signupId) => {
  if (!signupId) {
    return {
      success: false,
      generalMessage: 'Session invalid or signup ID missing. Please restart the application process.',
      fieldMessages: {},
    };
  }
  return { success: true };
}; 