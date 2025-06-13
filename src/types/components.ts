import type { Ref } from 'vue';

// ===============================
// FORM MANAGER TYPES
// ===============================

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: FormErrors;
}

export interface FormManagerBase<T> {
  formData: Ref<T>;
  fieldErrors: Ref<FormErrors>;
  formAlertError: Ref<string | null>;
  validate: (data: T) => Promise<ValidationResult>;
  clearErrors: (field?: string) => void;
  clearPersistedFormState: () => void;
}

// ===============================
// BRANCH COMPONENT TYPES
// ===============================

export interface BranchFormData {
  selectedBranch: string;
  preferredContactMethod: string;
  bestContactTime: string;
}

export interface BranchFormManager extends FormManagerBase<BranchFormData> {
  validateFormField: (field: string, data: BranchFormData) => void;
  hasUnsavedChanges: Ref<boolean>;
}

// ===============================
// MEMBERSHIP DECLARATION TYPES
// ===============================

export interface MembershipDeclarationFormData {
  isMemberOfAnotherCreditUnion: string;
  creditUnionName: string;
  isServingOnBoard: string;
  creditUnionBoardName: string;
}

export interface MembershipDeclarationFormManager extends FormManagerBase<MembershipDeclarationFormData> {
  validateFormField?: (field: string) => Promise<boolean>;
}

// ===============================
// STEPPER COMPONENT TYPES
// ===============================

export interface StepperStep {
  title: string;
  route: string;
  isComplete: boolean;
  stepNumber: number;
}

export interface StepChangeEvent {
  step: string;
  index: number;
}

export interface StepClickEvent {
  stepIndex: number;
  step?: StepperStep;
}

export interface StepperManager {
  completedSteps: Ref<string[]>;
  currentStepNumber: Ref<number>;
  markStepComplete: (step: string) => void;
  navigateToStep: (index: number | string) => void;
}

// ===============================
// API RESPONSE TYPES
// ===============================

export interface ApiSubmissionResult {
  success: boolean;
  data?: any;
  fieldMessages?: FormErrors;
  generalMessage?: string;
}

// ===============================
// GENERIC COMPONENT PROPS
// ===============================

export interface ComponentEmits {
  close: [];
  'step-change': [StepChangeEvent];
  'step-click': [StepClickEvent];
  submit: [any];
}

// ===============================
// FORM FIELD TYPES
// ===============================

export interface FormFieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  label: string;
  items: FormFieldOption[];
  modelValue: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: string;
  options: FormFieldOption[];
  modelValue: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

// ===============================
// CHILD ID FORM TYPES
// ===============================

export interface ChildIdFormData {
  childId: string;
  childName: string;
  childAge: string;
  schoolName: string;
  firstIdType: string;
  firstIdNumber: string;
  firstExpiryDate: string;
  firstIdDocument: File[];
  firstIdDocumentName: string | null;
  hasSecondId: boolean;
  secondIdType: string;
  secondIdNumber: string;
  secondExpiryDate: string;
  secondIdDocument: File[];
  secondIdDocumentName: string | null;
}

export interface ChildIdFormManager extends FormManagerBase<ChildIdFormData> {
  validateFormField: (field: string) => Promise<boolean>;
  previouslyUploadedFileNames: Ref<{
    first: string | null;
    second: string | null;
  }>;
  hasUnsavedChanges: Ref<boolean>;
}

// ===============================
// BENEFICIARY FORM TYPES
// ===============================

export interface BeneficiaryFormData {
  first_name: string;
  last_name: string;
  middle_name: string;
  dob: string;
  gender: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string;
  relationship_to_beneficiary: string;
  id_type: string;
  id_number: string;
  percent_of_beneficiary_interest: number | null;
}

export interface BeneficiaryFormManager extends FormManagerBase<BeneficiaryFormData> {
  addedBeneficiariesList: Ref<BeneficiaryFormData[]>;
  currentBeneficiaryFormAlert: Ref<string | null>;
  formWideAlert: Ref<string | null>;
  validateCurrentBeneficiaryForm: (data: BeneficiaryFormData) => Promise<ValidationResult>;
  clearCurrentBeneficiaryFormErrors: (field?: string) => void;
  resetCurrentBeneficiaryForm: () => void;
  addCurrentBeneficiaryToList: () => Promise<boolean>;
  openConfirmRemoveDialog: (index: number) => void;
  executeRemoveBeneficiary: () => void;
  confirmRemoveDialog: Ref<boolean>;
  totalPercentageAdded: Ref<number>;
  remainingPercentageAvailable: Ref<number>;
  autoFillPercentage: () => void;
  hasUnsavedChanges: Ref<boolean>;
  countdown: Ref<number>;
  showCountdown: Ref<boolean>;
  startCountdown: () => void;
}

// ===============================
// ADDRESS FORM TYPES
// ===============================

export interface AddressFormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  dwellingStatus: string;
  utilityBillType: string;
  proofOfAddress: File[];
}

export interface AddressFormManager extends FormManagerBase<AddressFormData> {
  validateFormField: (field: string) => Promise<boolean>;
  parseAndSetApiErrors: (errorData: any) => FormErrors;
}

// ===============================
// BASIC INFO FORM TYPES
// ===============================

export interface BasicInfoFormData {
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  employerName: string;
  monthlyIncome: string;
  sourceOfIncome: string;
  financialAgreementViewed: boolean;
}

export interface BasicInfoFormManager extends FormManagerBase<BasicInfoFormData> {
  validateFormField: (field: string) => Promise<boolean>;
  parseAndSetApiErrors: (errorData: any) => FormErrors;
  formState: Ref<{
    isDirty: boolean;
    isSaving: boolean;
    isSubmitting: boolean;
    hasErrors: boolean;
    canSubmit: boolean;
  }>;
  lastSaved: Ref<Date | null>;
  saveError: Ref<string | null>;
  showRecoveryDialog: Ref<boolean>;
  restoreFromSaved: () => void;
  discardSavedData: () => void;
} 