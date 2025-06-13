// Authentication Types

export interface User {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified?: boolean;
  [key: string]: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  user: User;
  signup_id?: string;
  [key: string]: any;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  currentUser: User | null;
}

export interface LoginResult {
  success: boolean;
  data?: LoginResponse;
  error?: string;
}

// Password Reset Types
export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

export interface PasswordResetState {
  email: string;
  isCodeSent: boolean;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  successMessage: string | null;
} 