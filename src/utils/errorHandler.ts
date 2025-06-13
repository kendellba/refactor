import type { AxiosError, ApiErrorResponse, AppErrorDetails, ErrorType } from '@/types/errors';
import { ErrorTypes } from '@/types/errors';

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly details: AppErrorDetails | null;

  constructor(message: string, type: ErrorType = ErrorTypes.UNKNOWN_ERROR, details: AppErrorDetails | null = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.details = details;
  }
}

export const errorTypes = ErrorTypes;

export const handleError = (error: AxiosError | Error | any): AppError => {
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
        return new AppError(message, ErrorTypes.VALIDATION_ERROR, { statusCode });
      case 401:
      case 403:
        return new AppError(message, ErrorTypes.AUTH_ERROR, { statusCode });
      case 413:
        return new AppError('File size too large', ErrorTypes.FILE_ERROR, { statusCode });
      case 415:
        return new AppError('Unsupported file type', ErrorTypes.FILE_ERROR, { statusCode });
      default:
        return new AppError(message, ErrorTypes.API_ERROR, { statusCode });
    }
  }

  // Handle network errors
  if (error.request) {
    return new AppError(
      'Unable to connect to the server. Please check your internet connection.',
      ErrorTypes.NETWORK_ERROR,
      { statusCode: 0 }
    );
  }

  // Handle all other errors
  return new AppError(
    error.message || 'An unexpected error occurred',
    ErrorTypes.UNKNOWN_ERROR,
    { statusCode: 500 }
  );
};

/**
 * Extract error message from API response
 * @param error - The error object from axios catch block
 * @param defaultMessage - Default message to show if no specific error found
 * @returns The most specific error message available
 */
export const getBackendErrorMessage = (error: AxiosError | Error | any, defaultMessage: string = 'An error occurred'): string => {
  // Backend API error with data
  if (error.response && error.response.data) {
    const backendError: ApiErrorResponse = error.response.data;

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
