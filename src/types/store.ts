// Store Types for DemoStore

export interface BasicInfo {
  firstName: string;
  lastName: string;
  otherName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dob: string;
  nationality: string;
  password: string;
  confirmPassword: string;
  termsViewed: boolean;
  financialAgreementViewed: boolean;
}

export interface AddressInfo {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  dwellingStatus: string;
  addressId: string | null;
}

export interface MailingAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
}

export interface BranchInfo {
  branchName: string;
  branchCode: string;
  branchLocation: string;
  preferredContactMethod: string;
  bestContactTime: string;
}

export interface EmploymentInfo {
  employerName: string;
  employerAddressLine1: string;
  employerAddressLine2: string;
  employerCity: string;
  employerCountry: string;
  workNumber: string;
  employmentStatus: string;
  employmentType: string;
}

export interface ChildInfo {
  childId: string;
  childName: string;
  childAge: string;
  schoolName: string;
  firstIdType: string;
  firstIdNumber: string;
  firstExpiryDate: string;
  firstIdDocument: File | null;
  firstIdDocumentName?: string | null;
  hasSecondId?: boolean;
  secondIdType: string;
  secondIdNumber: string;
  secondExpiryDate: string;
  secondIdDocument: File | null;
  secondIdDocumentName?: string | null;
  holder_type?: string;
}

export interface BankInfo {
  bankName: string;
  bankAddressLine1: string;
  bankCity: string;
  bankCountry: string;
  bankAccountNumber: string;
  swiftCode: string;
  bankTelephoneNumber: string;
}

export interface PepInfo {
  isPEP: boolean | null;
  pepPosition: string[];
  pepRelationship: string[];
  internationalOrgPEP: string[];
  pepAssociate: string;
  pepAssociateDetails: string;
  pepAssociateName: string;
  relationshipToPep: string;
  pepName: string;
  domestic_foreign_roles?: string[];
  immediate_family_members?: string[];
  international_roles?: string[];
  jobTitle?: string;
  is_close_associate?: boolean;
  relationship_type?: string;
  associate_name?: string;
}

export interface BeneficiaryInfo {
  [key: string]: any; // Define based on actual beneficiary structure
}

export interface GuardianInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  occupation: string;
  workplace: string;
  email: string;
  mobile: string;
  relationshipToChild: string;
  guardian_files: File | null;
}

export interface MembershipInfo {
  isMemberOfAnotherCreditUnion: 'yes' | 'no';
  creditUnionName: string;
  isServingOnBoard: 'yes' | 'no';
  creditUnionBoardName: string;
}

export interface PowerOfAttorneyInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  dob: string;
  gender: string;
  relationshipToPrincipal: string;
  email: string;
  phone: string;
  idNumber: string;
  idType: string;
  idDocument: File | null;
  powerOfAttorneyDocument: File | null;
}

export interface MailingAddressInfo {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  dwellingStatus: string;
  sameAsResidential: boolean;
}

export interface IdInformation {
  firstIdType: string;
  firstIdNumber: string;
  firstExpiryDate: string;
  secondIdType: string;
  secondIdNumber: string;
  secondExpiryDate: string;
  signup_id: string | null;
  holder_type: string;
}

export interface AuthData {
  userId: string | number;
  accessToken: string;
  mobileNumber: string;
}

export interface ForeignNationalInfo {
  [key: string]: any; // Define based on actual structure
}

// Main DemoStore State Interface
export interface DemoStoreState {
  customerType: string | null;
  isNewCustomer: boolean;
  isExistingCustomer: boolean;
  signupId: string | null;
  isEmailVerified: boolean;
  emailVerifiedOn: string | null;
  isMobileVerified: boolean;
  mobileVerifiedOn: string | null;
  verificationCode: string;
  basicInfo: BasicInfo;
  addressInfo: AddressInfo;
  mailingAddress: MailingAddress;
  branchInfo: BranchInfo;
  employmentInfo: EmploymentInfo;
  childInfo: ChildInfo;
  bankInfo: BankInfo;
  pepInfo: PepInfo;
  beneficiaryInfo: BeneficiaryInfo[];
  guardianInfo: GuardianInfo;
  membershipInfo: MembershipInfo;
  powerOfAttorneyInfo: PowerOfAttorneyInfo;
  skipPowerOfAttorney: boolean;
  agreed_to_tc_fa: boolean;
  userId: string | number | null;
  accessToken: string | null;
  mobileNumber: string | null;
  isAuthenticated: boolean;
  mailingAddressInfo: MailingAddressInfo;
  idInformation: IdInformation;
  accountNumber?: string;
  isDataLoaded?: boolean;
  childIdInfo?: ChildInfo;
  foreignNationalInfo?: ForeignNationalInfo;
  idInfo?: IdInformation;
  dob?: string;
}

// Action parameter types
export type CustomerType = string | null;
export type SignupId = string | null; 