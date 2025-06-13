// API Types for Request/Response handling

export interface BaseApiResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

// Email Verification API Types
export interface EmailVerificationRequest {
  identifier_type: 'email';
  operation: string;
  email?: string;
  signup_id?: string;
}

export interface EmailVerificationCodeRequest extends EmailVerificationRequest {
  code: string;
}

export interface EmailVerificationResponse extends BaseApiResponse {
  verified_on?: string;
  signup_id?: string;
  email?: string;
  identifier?: string;
}

// Mobile Verification API Types
export interface MobileVerificationRequest {
  identifier_type: 'mobile';
  operation: string;
  mobile?: string;
  signup_id?: string;
}

export interface MobileVerificationCodeRequest extends MobileVerificationRequest {
  code: string;
}

export interface MobileVerificationResponse extends BaseApiResponse {
  verified_on?: string;
  signup_id?: string;
  mobile?: string;
  identifier?: string;
}

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
} 