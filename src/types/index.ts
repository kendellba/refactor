import type { Ref, ComputedRef } from 'vue';

// Basic user and form types for gradual migration

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  [key: string]: any; // Allow additional properties during migration
}

export interface FormError {
  field?: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FormError[];
}

export interface OnboardingStep {
  route: string;
  title: string;
  subtitle: string;
  icon: string;
  category: string;
}

export interface FormState {
  isDirty: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  hasErrors: boolean;
  canSubmit: boolean;
}

// Auto-save related types
export interface AutoSaveOptions {
  saveInterval?: number;
  storageKey?: string | null;
  encryptSensitiveData?: boolean;
  sensitiveFields?: string[];
  enableCrossTabSync?: boolean;
  showSaveIndicator?: boolean;
  maxDrafts?: number;
  compressionEnabled?: boolean;
}

export interface SavedData {
  data: Record<string, any>;
  metadata: {
    timestamp: number;
    route: string;
    userAgent: string;
    version: string;
  };
  _autoSave: true;
}

// Vue component prop types for common use cases
export interface BaseComponentProps {
  id?: string;
  class?: string;
  style?: string | Record<string, any>;
}

// Utility types for gradual migration
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Constants types
export interface Option {
  title: string;
  value: string;
}

export type Country = string;

export type Gender = 'Male' | 'Female';

export type MaritalStatus = 'Single' | 'Married' | 'Common-Law' | 'Divorced' | 'Widowed';

export type EmploymentStatus = 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';

export type FileSize = {
  readonly MB: number;
  readonly BYTES: number;
};

// Utility types for constants
export type StringArray = readonly string[];
export type OptionArray = readonly Option[];

// Extended option types for different use cases
export interface LabelValueOption {
  label: string;
  value: string;
}

export type LabelValueOptionArray = readonly LabelValueOption[];

// PEP related types
export type PepPosition = 'head_of_state' | 'senior_politician' | 'senior_government_official' | 'senior_judicial_official' | 'senior_military_official' | 'senior_executive_soc' | 'high_ranking_party_official' | 'other';

export type PepRelationship = 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'close_associate';

export type InternationalOrganization = 'iadb' | 'cfatf' | 'oas' | 'ilo' | 'military_official' | 'senior_legislature' | 'other';

// Contact related types
export type ContactMethod = 'phone' | 'email';

export type ContactTime = '8:00am to 12:00pm' | '12:00pm to 4:00pm' | 'Anytime 8:00am to 4:00pm';

// Component-related types
export interface SaveStatus {
  text: string;
  color: 'info' | 'error' | 'success' | 'warning';
  icon: string;
}

export interface StepItem {
  title: string;
  subtitle?: string;
  icon?: string;
  route?: string;
  id?: string;
}

export interface StepClickEvent {
  stepIndex: number;
  step: StepItem;
}

export interface StepChangeEvent {
  stepIndex: number;
  step: StepItem;
  currentStep: number;
}

// Vue prop types helpers
export type PropType<T> = () => T;
export type DateOrNumber = Date | number;

// Vuetify types
export type VuetifyVariant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
export type VuetifyColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | string;

// Form types for components
export interface LoginFormData {
  email: string;
  password: string;
}

export interface FormErrors {
  [key: string]: string | string[] | undefined;
}

export interface DemoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ssn: string;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  action?: () => void;
  actionText?: string;
}

// Branch form types
export interface BranchFormData {
  selectedBranch: string;
  preferredContactMethod: string;
  bestContactTime: string;
}

// Onboarding layout types
export interface OnboardingStepperProps {
  showStepper?: boolean;
  showMobileNavigation?: boolean;
  allowStepNavigation?: boolean;
  showFloatingProgress?: boolean;
}

export interface StepCompleteEvent {
  step: StepItem;
}

export interface StepSaveData {
  [key: string]: any;
}

// Address form types
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

// OnboardingStepper types
export interface OnboardingStepperEmits {
  'step-change': [event: { stepIndex: number; step: StepItem; route: string }];
  'step-complete': [event: { stepIndex: number; step: StepItem }];
}

export interface OnboardingStepperData {
  steps: StepItem[];
  completedSteps: string[];
  showMobileNavigation?: boolean;
  allowStepNavigation?: boolean;
}

// BasicInfo form types
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

// Password strength types (avoiding duplication)
export interface PasswordStrength {
  overall: number;
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

// Batch 5 types - Auth, View, and Verification components  
export interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerificationFormData {
  verificationCode: string;
}

export interface MobileVerificationFormData {
  verificationCode: string;
}

export interface VerificationCodeOptions {
  length: number;
  maxResendAttempts: number;
  resendTimeout: number;
}

export interface NavigationResult {
  success: boolean;
  shouldNavigate: boolean;
  route: string;
}

export interface SubmissionResult {
  success: boolean;
  shouldNavigate: boolean;
  route?: string;
}

export interface ForgotPasswordFormData {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
}

export interface SchoolAutocompleteProps {
  modelValue: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  required?: boolean;
}

export interface SchoolAutocompleteEmits {
  'update:modelValue': [value: string];
  'validate': [];
}

export interface DueDiligenceData {
  items: string[];
  // Add other due diligence specific fields as needed
}

// Phase 4 types - Advanced Components & Enhanced Interfaces

// Enhanced BasicInfo form to fix current type errors
export interface EnhancedBasicInfoFormData {
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

// Account number form types
export interface AccountNumberFormData {
  account_number: string;
}

// Transfer component types
export interface TransferComponentProps {
  isMobile?: boolean;
}

export interface TransferComponentEmits {
  'back': [];
}

// Dashboard component types
export interface DashboardComponentProps {
  isMobile?: boolean;
}

// Enhanced form manager types
export interface FormManager<T> {
  formData: import('vue').Ref<T>;
  fieldErrors: import('vue').Ref<FormErrors>;
  formAlertError: import('vue').Ref<string>;
  validate: () => Promise<boolean>;
  clearErrors: () => void;
}

// Store types for demo store
export interface DemoStoreState {
  accountNumber?: string;
  signupId?: string;
}

export interface DemoStoreMethods {
  setSignupId: (id: string) => void;
  setNewCustomer: (value: boolean) => void;
  setExistingCustomer: (value: boolean) => void;
  $patch: (state: Partial<DemoStoreState>) => void;
}

// Enhanced error message type for components
export type ErrorMessage = string | string[] | undefined;

// Helper function to get error message as string
export const getErrorMessage = (error: ErrorMessage): string => {
  if (!error) return '';
  return Array.isArray(error) ? error[0] : error;
};