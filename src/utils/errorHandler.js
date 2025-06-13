export class AppError extends Error {
  constructor(message, type = errorTypes.UNKNOWN_ERROR, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.details = details;
  }
}

export const errorTypes = {
  VALIDATION_ERROR: 'validation_error',
  API_ERROR: 'api_error',
  AUTH_ERROR: 'auth_error',
  NETWORK_ERROR: 'network_error',
  UNKNOWN_ERROR: 'unknown_error',
};

export const handleError = (error) => {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }

  // Handle Axios errors
  if (error.response) {
    const statusCode = error.response.status;
    const message =
      error.response.data?.detail || 'An error occurred while processing your request';

    switch (statusCode) {
      case 400:
        return new AppError(message, errorTypes.VALIDATION_ERROR, statusCode);
      case 401:
      case 403:
        return new AppError(message, errorTypes.AUTH_ERROR, statusCode);
      case 413:
        return new AppError('File size too large', errorTypes.FILE_ERROR, statusCode);
      case 415:
        return new AppError('Unsupported file type', errorTypes.FILE_ERROR, statusCode);
      default:
        return new AppError(message, errorTypes.API_ERROR, statusCode);
    }
  }

  // Handle network errors
  if (error.request) {
    return new AppError(
      'Unable to connect to the server. Please check your internet connection.',
      errorTypes.NETWORK_ERROR,
      0
    );
  }

  // Handle all other errors
  return new AppError(
    error.message || 'An unexpected error occurred',
    errorTypes.UNKNOWN_ERROR,
    500
  );
};

/**
 * Extract error message from API response
 * @param {Error} error - The error object from axios catch block
 * @param {string} defaultMessage - Default message to show if no specific error found
 * @returns {string} The most specific error message available
 */
export const getBackendErrorMessage = (error, defaultMessage = 'An error occurred') => {
  // Backend API error with data
  if (error.response && error.response.data) {
    const backendError = error.response.data;

    // Try to get the most specific error message from the backend
    const errorMsg =
      backendError.detail ||
      backendError.message ||
      backendError.error ||
      (typeof backendError === 'string' ? backendError : null);

    if (errorMsg) {
      return errorMsg;
    }

    // If we have a status code but no message, use status code
    if (error.response.status) {
      return `${defaultMessage} (${error.response.status})`;
    }
  }

  // Network or other non-response error
  if (error.message) {
    return error.message;
  }

  // Fallback generic message
  return defaultMessage;
};
