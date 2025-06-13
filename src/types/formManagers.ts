import type { Ref, ComputedRef } from 'vue';
import type { FormErrors } from './index';

// Base form manager interface that all form managers extend
export interface BaseFormManager<T> {
  formData: Ref<T>;
  fieldErrors: Ref<FormErrors>;
  formSubmitError: Ref<string>;
  isLoading: Ref<boolean>;
  validate: (data?: T) => Promise<{ isValid: boolean; errors: any }>;
  validateField: (fieldName: string) => Promise<void>;
  clearErrors: () => void;
  getFieldError: (fieldName: string) => string;
  hasUnsavedChanges: ComputedRef<boolean>;
}

// Email verification form manager interface
export interface EmailVerificationFormManager extends BaseFormManager<EmailVerificationFormData> {
  countdown: Ref<number>;
  isRequestingCode: Ref<boolean>;
  userEmail: Ref<string>;
  VERIFICATION_CODE_LENGTH: number;
  handleRequestNewCode: () => Promise<void>;
  formatInput: (event: any) => void;
  startResendCountdown: () => void;
}

// Mobile verification form manager interface
export interface MobileVerificationFormManager extends BaseFormManager<MobileVerificationFormData> {
  countdown: Ref<number>;
  isResendDisabled: Ref<boolean>;
  isSendingCode: Ref<boolean>;
  resendCount: Ref<number>;
  maxResendAttempts: number;
  handleResendVerificationCode: () => Promise<void>;
  formatInput: (event: any) => void;
  getNavigationForError: () => { shouldNavigate: boolean; route?: string } | null;
}

// Basic info form manager interface
export interface BasicInfoFormManager extends BaseFormManager<BasicInfoFormData> {
  clearPersistedFormState: () => void;
  discardSavedData: () => void;
  saveFormState: () => void;
  loadPersistedFormState: () => void;
}

// Address form manager interface  
export interface AddressFormManager extends BaseFormManager<AddressFormData> {
  clearPersistedFormState: () => void;
  saveFormState: () => void;
  loadPersistedFormState: () => void;
}

// Account number form manager interface
export interface AccountNumberFormManager extends BaseFormManager<AccountNumberFormData> {
  serverError: Ref<string>;
  validateField: (fieldName: string) => Promise<void>;
}

// Employment information form manager interface
export interface EmploymentFormManager extends BaseFormManager<EmploymentFormData> {
  clearPersistedFormState: () => void;
  saveFormState: () => void;
  loadPersistedFormState: () => void;
}

// ID information form manager interface
export interface IDInformationFormManager extends BaseFormManager<IDInformationFormData> {
  clearPersistedFormState: () => void;
  saveFormState: () => void;
  loadPersistedFormState: () => void;
}

// Membership declaration form manager interface
export interface MembershipDeclarationFormManager extends BaseFormManager<MembershipDeclarationFormData> {
  // Specific properties for membership declaration if any
}

// Form data types (import from main types file or define here)
export interface EmailVerificationFormData {
  verificationCode: string;
}

export interface MobileVerificationFormData {
  verificationCode: string;
}

export interface BasicInfoFormData {
  firstName: string;
  lastName: string;
  otherName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  occupation: string;
  password: string;
  confirmPassword: string;
  countryOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  secondNationality: string;
  schoolName: string | null;
  isHomeschooled: boolean;
  hasForeignBankAccount: boolean;
  agreeToTerms: boolean;
  agreeToFinancialDeclaration: boolean;
  termsViewed: boolean;
  financialAgreementViewed: boolean;
}

export interface AddressFormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  dwellingStatus: string;
  utilityBillType: string;
  proofOfAddress: any[];
}

export interface AccountNumberFormData {
  account_number: string;
}

export interface EmploymentFormData {
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  workAddress: string;
  workPhone: string;
  monthlyIncome: number;
  yearsWithEmployer: number;
}

export interface IDInformationFormData {
  idType: string;
  idNumber: string;
  issuingCountry: string;
  expiryDate: string;
  idDocuments: any[];
}

export interface MembershipDeclarationFormData {
  isMemberOfAnotherCreditUnion: string;
  creditUnionName: string;
  isServingOnBoard: string;
  creditUnionBoardName: string;
}

// Type guard functions to help with type checking
export const isEmailVerificationFormManager = (
  manager: any
): manager is EmailVerificationFormManager => {
  return manager && 'countdown' in manager && 'handleRequestNewCode' in manager;
};

export const isMobileVerificationFormManager = (
  manager: any
): manager is MobileVerificationFormManager => {
  return manager && 'isResendDisabled' in manager && 'handleResendVerificationCode' in manager;
};

export const isBasicInfoFormManager = (
  manager: any
): manager is BasicInfoFormManager => {
  return manager && 'clearPersistedFormState' in manager && 'discardSavedData' in manager;
};

// Helper type for form manager factory
export type FormManagerType = 
  | EmailVerificationFormManager
  | MobileVerificationFormManager
  | BasicInfoFormManager
  | AddressFormManager
  | AccountNumberFormManager
  | EmploymentFormManager
  | IDInformationFormManager
  | MembershipDeclarationFormManager;

// Utility type for extracting form data type from form manager
export type FormDataFromManager<T> = T extends BaseFormManager<infer U> ? U : never; 