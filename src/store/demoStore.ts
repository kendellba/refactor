import { defineStore } from 'pinia';
import type {
  DemoStoreState,
  BasicInfo,
  AddressInfo,
  MailingAddress,
  BranchInfo,
  EmploymentInfo,
  ChildInfo,
  BankInfo,
  PepInfo,
  BeneficiaryInfo,
  GuardianInfo,
  MembershipInfo,
  PowerOfAttorneyInfo,
  IdInformation,
  AuthData,
  CustomerType,
  SignupId
} from '@/types/store';

export const useDemoStore = defineStore('demo', {
  state: (): DemoStoreState => ({
    customerType: localStorage.getItem('customerType') || null,
    isNewCustomer: localStorage.getItem('isNewCustomer') === 'true' || false,
    isExistingCustomer: localStorage.getItem('isExistingCustomer') === 'true' || false,
    signupId: localStorage.getItem('signupId') || null,
    isEmailVerified: false,
    emailVerifiedOn: null,
    isMobileVerified: false,
    mobileVerifiedOn: null,
    verificationCode: '',

    // Basic Information
    basicInfo: {
      firstName: '',
      lastName: '',
      otherName: '',
      email: '',
      mobileNumber: '',
      gender: '',
      dob: '',
      nationality: '',
      password: '',
      confirmPassword: '',
      termsViewed: false,
      financialAgreementViewed: false,
    },

    // Address Information
    addressInfo: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      dwellingStatus: '',
      addressId: null,
    },

    // Mailing Address
    mailingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
    },

    // Branch Information
    branchInfo: {
      branchName: '',
      branchCode: '',
      branchLocation: '',
      preferredContactMethod: '',
      bestContactTime: '',
    },

    // Employment Information
    employmentInfo: {
      employerName: '',
      employerAddressLine1: '',
      employerAddressLine2: '',
      employerCity: '',
      employerCountry: '',
      workNumber: '',
      employmentStatus: '',
      employmentType: '',
    },

    // Child Information
    childInfo: {
      childId: '',
      childName: '',
      childAge: '',
      schoolName: '',
      firstIdType: '',
      firstIdNumber: '',
      firstExpiryDate: '',
      firstIdDocument: null,
      secondIdType: '',
      secondIdNumber: '',
      secondExpiryDate: '',
      secondIdDocument: null,
    },

    // Bank Information
    bankInfo: {
      bankName: '',
      bankAddressLine1: '',
      bankCity: '',
      bankCountry: '',
      bankAccountNumber: '',
      swiftCode: '',
      bankTelephoneNumber: '',
    },

    // PEP Information
    pepInfo: {
      isPEP: null,
      pepPosition: [],
      pepRelationship: [],
      internationalOrgPEP: [],
      pepAssociate: '',
      pepAssociateDetails: '',
      pepAssociateName: '',
      relationshipToPep: '',
      pepName: '',
    },

    // Beneficiary Information
    beneficiaryInfo: [],

    // Guardian Information
    guardianInfo: {
      firstName: '',
      lastName: '',
      middleName: '',
      occupation: '',
      workplace: '',
      email: '',
      mobile: '',
      relationshipToChild: '',
      guardian_files: null,
    },

    // Membership Information
    membershipInfo: {
      isMemberOfAnotherCreditUnion: 'no',
      creditUnionName: '',
      isServingOnBoard: 'no',
      creditUnionBoardName: '',
    },

    // Power of Attorney Information
    powerOfAttorneyInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      dob: '',
      gender: '',
      relationshipToPrincipal: '',
      email: '',
      phone: '',
      idNumber: '',
      idType: '',
      idDocument: null,
      powerOfAttorneyDocument: null,
    },
    skipPowerOfAttorney: false,

    // Agreement Status
    agreed_to_tc_fa: false,

    // Auth state
    userId: null,
    accessToken: null,
    mobileNumber: null,
    isAuthenticated: false,
    mailingAddressInfo: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      dwellingStatus: '',
      sameAsResidential: false,
    },

    // ID Information
    idInformation: {
      firstIdType: '',
      firstIdNumber: '',
      firstExpiryDate: '',
      secondIdType: '',
      secondIdNumber: '',
      secondExpiryDate: '',
      signup_id: null,
      holder_type: '',
    },

    // Additional optional properties referenced in the app
    accountNumber: undefined,
    isDataLoaded: false,
    foreignNationalInfo: undefined,
  }),

  actions: {
    setCustomerType(type: CustomerType): void {
      this.customerType = type;
      if (type) {
        localStorage.setItem('customerType', type);
      } else {
        localStorage.removeItem('customerType');
      }
    },

    setNewCustomer(value: boolean): void {
      this.isNewCustomer = value;
      localStorage.setItem('isNewCustomer', String(value));
    },

    setExistingCustomer(value: boolean): void {
      this.isExistingCustomer = value;
      localStorage.setItem('isExistingCustomer', String(value));
    },

    clearCustomerState(): void {
      this.customerType = null;
      this.isNewCustomer = false;
      this.isExistingCustomer = false;
      localStorage.removeItem('customerType');
      localStorage.removeItem('isNewCustomer');
      localStorage.removeItem('isExistingCustomer');
    },

    setBasicInfo(info: Partial<BasicInfo>): void {
      this.basicInfo = { ...this.basicInfo, ...info };
    },

    setAddressInfo(info: Partial<AddressInfo>): void {
      this.addressInfo = { ...this.addressInfo, ...info };
    },

    setBranchInfo(branchData: Partial<BranchInfo>): void {
      this.branchInfo = { ...this.branchInfo, ...branchData };
    },

    setChildInfo(info: Partial<ChildInfo>): void {
      this.childInfo = { ...this.childInfo, ...info };
    },

    setMailingAddress(info: Partial<MailingAddress>): void {
      this.mailingAddress = { ...this.mailingAddress, ...info };
    },

    setEmploymentInfo(info: Partial<EmploymentInfo>): void {
      this.employmentInfo = { ...this.employmentInfo, ...info };
    },

    setIdInformation(info: Partial<IdInformation>): void {
      this.idInformation = { ...this.idInformation, ...info };
    },

    setPepInfo(info: Partial<PepInfo>): void {
      this.pepInfo = { ...this.pepInfo, ...info };
    },

    setBankInfo(info: Partial<BankInfo>): void {
      this.bankInfo = { ...this.bankInfo, ...info };
    },

    setBeneficiaryInfo(info: BeneficiaryInfo[]): void {
      this.beneficiaryInfo = [...info];
    },

    setGuardianInfo(info: Partial<GuardianInfo>): void {
      this.guardianInfo = { ...this.guardianInfo, ...info };
    },

    setMembershipInfo(info: Partial<MembershipInfo>): void {
      this.membershipInfo = { ...this.membershipInfo, ...info };
    },

    setPowerOfAttorneyInfo(info: Partial<PowerOfAttorneyInfo>): void {
      this.powerOfAttorneyInfo = { ...this.powerOfAttorneyInfo, ...info };
    },

    setVerificationCode(code: string): void {
      this.verificationCode = code;
    },

    setSignupId(id: SignupId): void {
      this.signupId = id;
      if (id) {
        localStorage.setItem('signupId', id);
      } else {
        localStorage.removeItem('signupId');
      }
    },

    setAgreementStatus(status: boolean): void {
      this.agreed_to_tc_fa = status;
    },

    setAuthData(data: AuthData): void {
      this.userId = data.userId;
      this.accessToken = data.accessToken;
      this.mobileNumber = data.mobileNumber;
    },

    setFinalAuthToken(token: string): void {
      this.accessToken = token;
      this.isAuthenticated = true;
    },

    clearAuth(): void {
      this.userId = null;
      this.accessToken = null;
      this.mobileNumber = null;
      this.isAuthenticated = false;
    },

    // Clear functions
    clearAll(): void {
      this.$reset();
    },

    clearBasicInfo(): void {
      this.basicInfo = {
        firstName: '',
        lastName: '',
        otherName: '',
        email: '',
        mobileNumber: '',
        gender: '',
        dob: '',
        nationality: '',
        password: '',
        confirmPassword: '',
        termsViewed: false,
        financialAgreementViewed: false,
      };
    },

    clearAddressInfo(): void {
      this.addressInfo = {
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        dwellingStatus: '',
        addressId: null,
      };
    },

    clearSignupData(): void {
      this.signupId = null;
      this.isExistingCustomer = false;
      this.clearBasicInfo();
    },

    clearMembershipData(): void {
      this.membershipInfo = {
        isMemberOfAnotherCreditUnion: 'no',
        creditUnionName: '',
        isServingOnBoard: 'no',
        creditUnionBoardName: '',
      };
    },

    clearPEPData(): void {
      this.pepInfo = {
        isPEP: null,
        pepPosition: [],
        pepRelationship: [],
        internationalOrgPEP: [],
        pepAssociate: '',
        pepAssociateDetails: '',
        pepAssociateName: '',
        relationshipToPep: '',
        pepName: '',
      };
    },

    clearIdInformation(): void {
      this.idInformation = {
        firstIdType: '',
        firstIdNumber: '',
        firstExpiryDate: '',
        secondIdType: '',
        secondIdNumber: '',
        secondExpiryDate: '',
        signup_id: null,
        holder_type: '',
      };
    },

    clearGuardianInfo(): void {
      this.guardianInfo = {
        firstName: '',
        lastName: '',
        middleName: '',
        occupation: '',
        workplace: '',
        email: '',
        mobile: '',
        relationshipToChild: '',
        guardian_files: null,
      };
    },

    clearBeneficiaryInfo(): void {
      this.beneficiaryInfo = [];
    },

    // Additional action methods referenced in the app
    setAccountNumber(accountNumber: string): void {
      this.accountNumber = accountNumber;
    },

    setForeignNationalInfo(info: any): void {
      this.foreignNationalInfo = { ...this.foreignNationalInfo, ...info };
    },
  },

  getters: {
    getCustomerType: (state): string | null => state.customerType,
    getIsNewCustomer: (state): boolean => state.isNewCustomer,
    getIsExistingCustomer: (state): boolean => state.isExistingCustomer,
    getDob: (state): string => state.basicInfo.dob,
    getAge: (state): number => {
      if (!state.basicInfo.dob) return 0;
      const today = new Date();
      const birthDate = new Date(state.basicInfo.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    getNationality: (state): string => state.basicInfo.nationality,
  },
});

