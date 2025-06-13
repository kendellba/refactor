// Onboarding API Types

import type { User } from './auth';
import type { BasicInfo, AddressInfo, EmploymentInfo, BeneficiaryInfo, IdInformation } from './store';

// Base API Response
export interface OnboardingApiResponse {
  id?: string | number;
  signup_id?: string;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

// Basic Info API
export interface BasicInfoApiRequest {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  mobile: string;
  school_name?: string;
  gender: string;
  dob: string;
  marital_status?: string;
  nationality: string;
  is_existing_customer: boolean;
  has_foreign_bank_account: boolean;
  terms_viewed: boolean;
  financial_agreement_viewed: boolean;
  password: string;
}

export interface BasicInfoApiResponse extends OnboardingApiResponse {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  mobile: string;
  school_name?: string;
  gender: string;
  dob: string;
  marital_status?: string;
  nationality: string;
}

// Branch Selection API
export interface BranchApiRequest {
  home_branch: string;
  signup_id: string;
  best_contact_time: string;
  preferred_contact_method: string;
}

export interface BranchApiResponse extends OnboardingApiResponse {
  home_branch: string;
  best_contact_time: string;
  preferred_contact_method: string;
}

// Address API
export interface AddressApiRequest {
  signup_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  country: string;
  dwelling_status: string;
  utility_bill_type?: string;
  proof_of_address?: File[];
}

export interface AddressApiResponse extends OnboardingApiResponse {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  country: string;
  dwelling_status: string;
}

// Employment API
export interface EmploymentApiRequest {
  signup_id: string;
  employer_name: string;
  employer_address: string;
  employment_status: string;
  job_title: string;
  work_phone: string;
  employment_duration: string;
  monthly_salary: string;
  employment_verification_documents?: File[];
}

export interface EmploymentApiResponse extends OnboardingApiResponse {
  employer_name: string;
  employer_address: string;
  employment_status: string;
  job_title: string;
  work_phone: string;
  employment_duration: string;
  monthly_salary: string;
}

// Email/Mobile Verification API
export interface VerificationApiRequest {
  signup_id: string;
  email: string;
  operation: string;
  code?: string;
}

export interface VerificationApiResponse extends OnboardingApiResponse {
  verified_on: string;
  signup_id: string;
  email: string;
  identifier: string;
}

// Foreign National Bank API
export interface ForeignBankApiRequest {
  signup_id: string;
  bank_name: string;
  account_number: string;
  address_line_1: string;
  city: string;
  country: string;
  phone: string;
  swift_code: string;
}

export interface ForeignBankApiResponse extends OnboardingApiResponse {
  bank_name: string;
  account_number: string;
  address_line_1: string;
  city: string;
  country: string;
  phone: string;
  swift_code: string;
}

// Mailing Address API
export interface MailingAddressApiRequest {
  signup_id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
}

export interface MailingAddressApiResponse extends OnboardingApiResponse {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
}

// Account Number Verification API
export interface AccountNumberApiRequest {
  account_number: string;
}

export interface AccountNumberApiResponse extends OnboardingApiResponse {
  account_number: string;
  verified: boolean;
}

// Generic API Result
export interface OnboardingApiResult<T = any> {
  success: boolean;
  data?: T;
  error?: any;
  generalMessage?: string;
  fieldMessages?: Record<string, string>;
} 