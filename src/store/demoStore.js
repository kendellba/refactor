import { defineStore } from 'pinia';

export const useDemoStore = defineStore({
  id: 'demo',
  state: () => ({
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
      preferredcontactmethod: '',
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
  }),

  actions: {
    setCustomerType(type) {
      this.customerType = type;
      localStorage.setItem('customerType', type);
    },

    setNewCustomer(value) {
      this.isNewCustomer = value;
      localStorage.setItem('isNewCustomer', value);
    },

    setExistingCustomer(value) {
      this.isExistingCustomer = value;
      localStorage.setItem('isExistingCustomer', value);
    },

    clearCustomerState() {
      this.customerType = null;
      this.isNewCustomer = false;
      this.isExistingCustomer = false;
      localStorage.removeItem('customerType');
      localStorage.removeItem('isNewCustomer');
      localStorage.removeItem('isExistingCustomer');
    },

    setBasicInfo(info) {
      this.basicInfo = { ...this.basicInfo, ...info };
    },

    setAddressInfo(info) {
      this.addressInfo = { ...this.addressInfo, ...info };
    },

    setBranchInfo(branchData) {
      this.branchInfo = branchData;
    },

    setChildInfo(info) {
      this.childInfo = { ...this.childInfo, ...info };
    },

    setMailingAddress(info) {
      this.mailingAddress = { ...this.mailingAddress, ...info };
    },

    setEmploymentInfo(info) {
      this.employmentInfo = { ...this.employmentInfo, ...info };
    },

    setIdInformation(info) {
      this.idInformation = { ...this.idInformation, ...info };
    },

    setPepInfo(info) {
      this.pepInfo = { ...this.pepInfo, ...info };
    },

    setBankInfo(info) {
      this.bankInfo = { ...this.bankInfo, ...info };
    },

    setBeneficiaryInfo(info) {
      this.beneficiaryInfo = { ...this.beneficiaryInfo, ...info };
    },

    setGuardianInfo(info) {
      this.guardianInfo = { ...this.guardianInfo, ...info };
    },

    setMembershipInfo(info) {
      this.membershipInfo = { ...this.membershipInfo, ...info };
    },

    setPowerOfAttorneyInfo(info) {
      this.powerOfAttorneyInfo = { ...this.powerOfAttorneyInfo, ...info };
    },

    setVerificationCode(code) {
      this.verificationCode = code;
    },

    setSignupId(id) {
      this.signupId = id;
    },

    setAgreementStatus(status) {
      this.agreed_to_tc_fa = status;
    },

    setAuthData(data) {
      this.userId = data.userId;
      this.accessToken = data.accessToken;
      this.mobileNumber = data.mobileNumber;
    },

    setFinalAuthToken(token) {
      this.accessToken = token;
      this.isAuthenticated = true;
    },

    clearAuth() {
      this.userId = null;
      this.accessToken = null;
      this.mobileNumber = null;
      this.isAuthenticated = false;
    },

    // Clear functions
    clearAll() {
      this.$reset();
    },

    clearBasicInfo() {
      this.basicInfo = this.$state.basicInfo;
    },

    clearAddressInfo() {
      this.addressInfo = this.$state.addressInfo;
    },

    clearSignupData() {
      this.signupId = null;
      this.isExistingCustomer = false;
      this.basicInfo = this.$state.basicInfo;
    },

    clearMembershipData() {
      this.membershipInfo = this.$state.membershipInfo;
    },

    clearPEPData() {
      this.pepInfo = this.$state.pepInfo;
    },

    clearIdInformation() {
      this.idInformation = this.$state.idInformation;
    },

    clearGuardianInfo() {
      this.guardianInfo = this.$state.guardianInfo;
    },

    clearBeneficiaryInfo() {
      this.beneficiaryInfo = this.$state.beneficiaryInfo;
    },
  },
  persist: {
    storage: localStorage,
    paths: ['idInformation', 'pepInfo', 'basicInfo', 'poaInfo'], // Added 'poaInfo' here!
  },

  getters: {
    getCustomerType: (state) => state.customerType,
    getIsNewCustomer: (state) => state.isNewCustomer,
    getIsExistingCustomer: (state) => state.isExistingCustomer,
    getDob: (state) => state.basicInfo.dob,
    getAge: (state) => {
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
    getNationality: (state) => state.basicInfo.nationality,
  },
});
