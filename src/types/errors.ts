// Error Handling Types

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  status?: number;
  data?: any;
}

export interface AxiosError {
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
  request?: any;
  message?: string;
}

export interface AppErrorDetails {
  statusCode?: number;
  originalError?: Error;
  timestamp?: Date;
  [key: string]: any;
}

export const ErrorTypes = {
  VALIDATION_ERROR: 'validation_error',
  API_ERROR: 'api_error',
  AUTH_ERROR: 'auth_error',
  NETWORK_ERROR: 'network_error',
  FILE_ERROR: 'file_error',
  UNKNOWN_ERROR: 'unknown_error',
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes]; 