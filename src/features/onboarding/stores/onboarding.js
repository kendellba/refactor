import { defineStore } from 'pinia';
import { ref } from 'vue';
import { submitAddress as submitAddressService } from '@/features/onboarding/services/address-api.js';
import { submitSignupData as submitSignupDataService } from '@/features/onboarding/services/basic-info-api.js';
import { submitBranchSelection as submitBranchSelectionService } from '@/features/onboarding/services/branch-api.js';
import { submitChildIdDocument as submitChildIdDocumentService } from '@/features/onboarding/services/child-id-api.js';
import { submitBeneficiary as submitBeneficiaryService } from '@/features/onboarding/services/beneficiary-api.js';
import { EmailVerificationApiService } from '@/features/onboarding/services/email-verification-api.js';
import { submitEmploymentInformation as submitEmploymentInformationService } from '@/features/onboarding/services/employment-api.js';
import { submitForeignNationalBankInfo as submitForeignNationalBankInfoService } from '@/features/onboarding/services/foreign-national-bank-api.js';
import { useDemoStore } from '@/store/demoStore'; // To potentially save final data
import { submitMailingAddress as submitMailingAddressService } from '@/features/onboarding/services/mailing-address-api.js';
import { MobileVerificationApiService } from '@/features/onboarding/services/mobile-verification-api.js';
import { MembershipApiService } from '@/features/onboarding/services/membership-api.js';
import { submitPepData as submitPepDataService } from '@/features/onboarding/services/pep-api.js';
import { uploadPowerOfAttorneyFiles, submitPowerOfAttorneyData as submitPowerOfAttorneyDataService } from '@/features/onboarding/services/poa-api';
import { verifyAccountNumber as verifyAccountNumberService } from '@/features/onboarding/services/account-number-api.js';
import { createFinalAccount as createFinalAccountService } from '@/features/onboarding/services/account-creation-api.js';
import { useRouter } from 'vue-router'; // Make sure useRouter is imported
import { handleApiError, validateSignupId } from '@/shared/services/error-handler';
import { API_FIELD_MAPPINGS } from '@/features/onboarding/constants/api-field-mappings';

// This mapping will be used by the store to understand API error structures if needed,
// or can be passed to a utility that populates component-level errors.
const API_FIELD_MAPPING_ADDRESS = {
  address_line_1: 'addressLine1',
  address_line_2: 'addressLine2',
  city: 'city',
  country: 'country',
  dwelling_status: 'dwellingStatus',
  utility_bill_type: 'utilityBillType',
  proof_of_address_files: 'proofOfAddress',
};

const API_FIELD_MAPPING_BASIC_INFO = {
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'otherName',
  email: 'email',
  mobile: 'mobileNumber',
  gender: 'gender',
  dob: 'dob',
  school_name: 'schoolName',
  nationality: 'nationality',
  marital_status: 'maritalStatus',
  password: 'password',
  confirmed_password: 'confirmPassword',
  // agreed_to_tc_fa is usually a validation error, not a field error from API
};

const API_FIELD_MAPPING_BRANCH = {
  home_branch: 'selectedBranch',
  best_contact_time: 'bestContactTime',
  preferred_contact_method: 'preferredContactMethod',
  signup_id: 'signupId', // Though signup_id is part of request, not usually a field with error from response directly
};

const API_FIELD_MAPPING_CHILD_ID = {
  id_type: 'idType', // Generic, will be prefixed by form (e.g., firstIdType)
  id_number: 'idNumber',
  id_expiry_date: 'expiryDate',
  id_files: 'idDocument', // Maps to the field holding the FileList/Array of Files
  // signup_id, holder_type, is_primary_id are part of request payload, not typically error fields from API response.
};

const API_FIELD_MAPPING_BENEFICIARY = {
  first_name: 'first_name',
  last_name: 'last_name',
  middle_name: 'middle_name',
  dob: 'dob',
  gender: 'gender',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  city: 'city',
  country: 'country',
  relationship_to_beneficiary: 'relationship_to_beneficiary',
  id_type: 'id_type',
  id_number: 'id_number',
  percent_of_beneficiary_interest: 'percent_of_beneficiary_interest',
  // signup_id is part of the request but not usually an error field from the API response mapped to a form field.
};

const API_FIELD_MAPPING_EMAIL_VERIFICATION = {
  code: 'verificationCode', 
  // Add other mappings if API returns specific field errors for email verification
};

const API_FIELD_MAPPING_EMPLOYMENT = {
  employer_name: 'employer_name',
  occupation: 'occupation',
  custom_occupation: 'custom_occupation',
  business_type: 'business_type',
  work_phone: 'work_phone',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  city: 'city',
  country: 'country',
  nis_number: 'nis_number',
  bir_number: 'bir_number',
  employment_status: 'employment_status',
  monthly_remuneration: 'monthly_remuneration',
  value_of_assets: 'value_of_assets',
  child_account_contribution: 'child_account_contribution',
  child_account_contribution_amount: 'child_account_contribution_amount',
  source_of_funds_type: 'source_of_funds',
  source_of_funds: 'source_of_funds',
  proof_of_employment_files: 'proof_of_employment_files',
  // is_business_owner is a boolean, less likely to be an API error field directly
};

const API_FIELD_MAPPING_FOREIGN_BANK = {
  bank_name: 'bank_name',
  account_number: 'account_number',
  swift_code: 'swift_code',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  city: 'city',
  country: 'country',
  phone: 'phone',
  // signup_id is part of the payload but not typically a field with an error message mapped back to the form.
};

// Reusing API_FIELD_MAPPING_CHILD_ID for IDInformation as structure of individual ID submission is similar
const API_FIELD_MAPPING_ID_INFORMATION = API_FIELD_MAPPING_CHILD_ID;

const API_FIELD_MAPPING_MAILING_ADDRESS = {
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  city: 'city',
  country: 'country',
  proof_of_address_files: 'proof_of_address_files',
  // signup_id, address_type are part of payload, not typical error fields from API.
};

const API_FIELD_MAPPING_MOBILE_VERIFICATION = {
  code: 'verificationCode',
  // signup_id, identifier_type, operation are part of payload
};

const API_FIELD_MAPPING_MEMBERSHIP_DECLARATION = {
  is_member_of_another_credit_union: 'isMemberOfAnotherCreditUnion',
  credit_union_name: 'creditUnionName',
  is_serving_on_credit_union_board: 'isServingOnBoard',
  board_credit_union_name: 'creditUnionBoardName',
  // signup_id is part of payload
};

// ADDED API_FIELD_MAPPING_PEP
const API_FIELD_MAPPING_PEP = {
  is_pep: 'isPEP',
  job_title: 'jobTitle',
  domestic_foreign_roles: 'domestic_foreign_roles',
  international_roles: 'international_roles',
  immediate_family_members: 'immediate_family_members',
  is_close_associate: 'is_close_associate', // Form uses 'yes'/'no', API expects boolean
  relationship_type: 'relationship_type',
  associate_name: 'associate_name',
  // signup_id, is_confirmed are part of payload
};

// ADDED API_FIELD_MAPPING_POA
const API_FIELD_MAPPING_POA = {
  first_name: 'first_name',
  last_name: 'last_name',
  middle_name: 'middle_name',
  dob: 'dob',
  gender: 'gender',
  email: 'email',
  phone: 'phone',
  relationship_to_principal: 'relationship_to_principal',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  city: 'city',
  country: 'country',
  id_type: 'id_type',
  id_number: 'id_number',
  // For FormData, file field errors are often general or tied to the specific file key used by API
  // e.g., 'id_document' or 'power_of_attorney_document' or a general 'files' key
  id_document: 'id_document', 
  power_of_attorney_document: 'power_of_attorney_document',
};

// --- Re-define calculateAge locally or import if it becomes a shared util ---
const calculateAgeUtility = (dobString) => {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
// --- End of calculateAge --- 

export const useOnboardingStore = defineStore('onboarding', () => {
  const demoStore = useDemoStore();
  const router = useRouter(); // Initialize router for navigation

  const isLoading = ref(false);
  const isRequestingCode = ref(false); // Used for email
  const isSendingMobileCode = ref(false); // For mobile code sending
  const apiSubmitError = ref(null); // For general API errors to display in an alert
  const apiFieldErrors = ref({}); // For field-specific API errors

  // Helper function to create FormData for the API call
  const _createApiFormDataForAddress = (addressData) => {
    console.log('=== Store: Creating Address FormData ===');
    console.log('Input addressData:', addressData);
    console.log('demoStore.signupId:', demoStore.signupId);
    
    // Validate required fields
    if (!demoStore.signupId) {
      throw new Error('Missing signup_id - cannot submit address data');
    }
    if (!addressData.addressLine1 || addressData.addressLine1.trim() === '') {
      throw new Error('Missing address line 1');
    }
    if (!addressData.city || addressData.city.trim() === '') {
      throw new Error('Missing city');
    }
    if (!addressData.country || addressData.country.trim() === '') {
      throw new Error('Missing country');
    }
    if (!addressData.dwellingStatus || addressData.dwellingStatus.trim() === '') {
      throw new Error('Missing dwelling status');
    }
    if (!addressData.utilityBillType || addressData.utilityBillType.trim() === '') {
      throw new Error('Missing utility bill type');
    }
    if (!addressData.proofOfAddress || !Array.isArray(addressData.proofOfAddress) || addressData.proofOfAddress.length === 0) {
      throw new Error('Missing proof of address files');
    }
    
    const apiFormData = new FormData();
    apiFormData.append('signup_id', demoStore.signupId);
    apiFormData.append('address_type', 'residential'); // Add the required address_type field
    apiFormData.append('address_line_1', addressData.addressLine1.trim());
    apiFormData.append('address_line_2', addressData.addressLine2 ? addressData.addressLine2.trim() : '');
    apiFormData.append('city', addressData.city.trim());
    apiFormData.append('country', addressData.country.trim());
    apiFormData.append('dwelling_status', addressData.dwellingStatus.trim());
    apiFormData.append('utility_bill_type', addressData.utilityBillType.trim());

    console.log('Processing proof of address files:', addressData.proofOfAddress.length, 'files');
    let validFileCount = 0;
      for (const file of addressData.proofOfAddress) {
      if (file instanceof File) {
        console.log('Adding file:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
            apiFormData.append('proof_of_address_files', file);
        validFileCount++;
      } else {
        console.log('Invalid file object:', file);
        }
      }
    
    if (validFileCount === 0) {
      throw new Error('No valid file objects found for proof of address');
    }
    
    console.log(`Added ${validFileCount} valid files to FormData`);
    console.log('=== End Store FormData Creation ===');
    return apiFormData;
  };

  // Action to submit address data
  const submitAddressData = async (currentAddressData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    try {
      console.log('=== Address Submission Started ===');
      console.log('Input data:', currentAddressData);
      
      let formDataForApi;
      try {
        formDataForApi = _createApiFormDataForAddress(currentAddressData);
      } catch (validationError) {
        console.error('Validation error creating address FormData:', validationError.message);
        throw new Error(`Address validation failed: ${validationError.message}`);
      }
      
      console.log('Submitting address data...');
      const response = await submitAddressService(formDataForApi);
      console.log('Address submitted successfully:', response);
      
      // On success, update the demoStore (or other relevant stores)
      demoStore.setAddressInfo(currentAddressData); // Assuming setAddressInfo exists in demoStore
      localStorage.removeItem('addressFormData'); // As done previously in component

      isLoading.value = false;
      console.log('=== Address Submission Completed Successfully ===');
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error submitting address via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during address submission.';
      const parsedFieldErrors = {};

      // Handle validation errors (thrown by our validation)
      if (error.message && !error.response) {
        generalError = error.message;
      } else if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_ADDRESS[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError) generalError = tempGeneralError;
        } else if (typeof errorData.detail === 'object') {
            // Handle other object structures if necessary
            // For now, stick to the array or string detail format.
        }
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;
      
      return { 
        success: false, 
        error: error, // The original error object
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  // Action to submit basic info data
  const submitBasicInfoFormData = async (currentBasicInfoData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    const age = calculateAgeUtility(currentBasicInfoData.dob);
    const isAdult = age >= 18;
    const isUnder18 = age < 18 && age > 0; // Assuming age > 0 means dob is valid past date

    const payload = {
      first_name: currentBasicInfoData.firstName,
      last_name: currentBasicInfoData.lastName,
      middle_name: currentBasicInfoData.otherName || null,
      email: currentBasicInfoData.email,
      mobile: currentBasicInfoData.mobileNumber,
      password: currentBasicInfoData.password,
      confirmed_password: currentBasicInfoData.confirmPassword, // API should handle confirmation ideally
      gender: currentBasicInfoData.gender,
      school_name: isUnder18 && !currentBasicInfoData.isHomeschooled ? currentBasicInfoData.schoolName : null,
      dob: currentBasicInfoData.dob,
      nationality: currentBasicInfoData.nationality,
      is_existing_customer: demoStore.isExistingCustomer || false, // Assuming this is from demoStore state
      agreed_to_tc_fa: currentBasicInfoData.termsViewed && currentBasicInfoData.financialAgreementViewed,
      marital_status: isAdult ? currentBasicInfoData.maritalStatus : 'Single',
      is_home_schooled: isUnder18 ? currentBasicInfoData.isHomeschooled : false,
      has_foreign_bank_account: currentBasicInfoData.hasForeignBankAccount || false,
    };

    try {
      const response = await submitSignupDataService(payload);
      
      // On success, update the demoStore
      // Assuming demoStore has a method like setBasicInfo or can be patched
      if (demoStore.setBasicInfo) { // Check if method exists
        demoStore.setBasicInfo(response); 
      } else {
        // Fallback to patching relevant fields if setBasicInfo doesn't exist
        demoStore.$patch({
            firstName: response.first_name,
            lastName: response.last_name,
            otherName: response.middle_name,
            email: response.email,
            mobileNumber: response.mobile,
            schoolName: response.school_name,
            gender: response.gender,
            dob: response.dob,
            maritalStatus: response.marital_status,
            nationality: response.nationality,
            // Note: isExistingCustomer, hasForeignBankAccount, termsViewed etc. are part of request but might not all be in response to set back
        });
      }
      if (response.id) { // Assuming API returns an id for the signup
        demoStore.signupId = response.id;
      }
      
      localStorage.removeItem('basicInfoFormData'); // To be managed by form manager later

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error submitting basic info via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during basic information submission.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_BASIC_INFO[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError) generalError = tempGeneralError;
        } // Potentially handle other error object structures from errorData.detail if not string/array
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  // Action to submit branch selection data
  const submitBranchData = async (currentBranchData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    const payload = {
      home_branch: currentBranchData.selectedBranch,
      signup_id: demoStore.signupId, // Assumes signupId is populated in demoStore
      best_contact_time: currentBranchData.bestContactTime,
      preferred_contact_method: currentBranchData.preferredContactMethod,
    };

    try {
      const response = await submitBranchSelectionService(payload);

      // On success, update the demoStore
      demoStore.$patch({
        branchInfo: {
          branchName: currentBranchData.selectedBranch,
          branchLocation: currentBranchData.selectedBranch, // Or derive as needed
          branchCode: currentBranchData.selectedBranch === 'Port of Spain' ? 'POS' : 'TOB',
          preferredContactMethod: currentBranchData.preferredContactMethod,
          bestContactTime: currentBranchData.bestContactTime,
        },
      });
      // No explicit localStorage.removeItem here, form manager will handle its own state.

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error submitting branch data via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during branch selection submission.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1]; // Assuming error is on a direct field
              const formFieldKey = API_FIELD_MAPPING_BRANCH[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
          else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length && errorData.detail.length > 0) {
             // If array is not empty but didn't parse to field errors or general, construct one
             generalError = errorData.detail.map(e => e.msg || 'Unknown error detail').join('; ');
          } else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length) {
            // Default if detail array is empty or unparsable to specific messages
            generalError = 'Failed to process branch selection due to validation issues.';
          }
        } else {
            generalError = 'Failed to process branch selection. Please check your input.';
        }
      }

      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;

      return {
        success: false,
        error: error,
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors,
      };
    }
  };

  const _createChildIdFormData = (idData, idKeyPrefix, isPrimary) => {
    // Log the input data for debugging
    console.log('=== Store: Creating Child ID FormData ===');
    console.log('Input idData:', idData);
    console.log('idKeyPrefix:', idKeyPrefix);
    console.log('isPrimary:', isPrimary);
    console.log('demoStore.signupId:', demoStore.signupId);
    
    const formData = new FormData();
    
    // Validate signup_id
    if (!demoStore.signupId) {
      throw new Error('Missing signup_id - cannot submit child ID data');
    }
    formData.append('signup_id', demoStore.signupId);
    
    const idType = idData[`${idKeyPrefix}IdType`];
    const idNumber = idData[`${idKeyPrefix}IdNumber`];
    const expiryDate = idData[`${idKeyPrefix}ExpiryDate`];
    const documents = idData[`${idKeyPrefix}IdDocument`];
    
    console.log('Extracted values:');
    console.log(`${idKeyPrefix}IdType:`, idType, `(type: ${typeof idType})`);
    console.log(`${idKeyPrefix}IdNumber:`, idNumber, `(type: ${typeof idNumber})`);
    console.log(`${idKeyPrefix}ExpiryDate:`, expiryDate, `(type: ${typeof expiryDate})`);
    console.log(`${idKeyPrefix}IdDocument:`, documents, `(type: ${typeof documents}, isArray: ${Array.isArray(documents)})`);
    
    // Validate required fields
    if (!idType || idType.trim() === '') {
      throw new Error(`Missing ${idKeyPrefix} ID type`);
    }
    if (!idNumber || idNumber.trim() === '') {
      throw new Error(`Missing ${idKeyPrefix} ID number`);
    }
    if (!expiryDate || expiryDate.trim() === '') {
      throw new Error(`Missing ${idKeyPrefix} expiry date`);
    }
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      throw new Error(`Missing ${idKeyPrefix} ID documents`);
    }
    
    formData.append('id_type', idType.trim());
    formData.append('holder_type', 'child');
    formData.append('id_number', idNumber.trim());
    formData.append('id_expiry_date', expiryDate.trim()); // Ensure date isYYYY-MM-DD
    formData.append('is_primary_id', String(isPrimary));

    console.log('Processing documents:', documents.length, 'files');
    let validFileCount = 0;
    documents.forEach((file, index) => {
        if (file instanceof File) {
        console.log(`Document ${index}:`, {
          name: file.name,
          size: file.size,
          type: file.type
        });
          formData.append('id_files', file);
        validFileCount++;
      } else {
        console.log(`Document ${index} is not a File object:`, file);
        }
      });
    
    if (validFileCount === 0) {
      throw new Error(`No valid file objects found for ${idKeyPrefix} ID`);
    }
    
    console.log(`Added ${validFileCount} valid files to FormData`);
    console.log('=== End Store FormData Creation ===');
    return formData;
  };

  const submitChildIdData = async (currentChildIdData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};
    let overallSuccess = true;
    let responses = [];

    try {
      console.log('=== Child ID Submission Started ===');
      console.log('Input data:', currentChildIdData);
      
      // Submit First ID
      let firstIdFormData;
      try {
        firstIdFormData = _createChildIdFormData(currentChildIdData, 'first', true);
      } catch (validationError) {
        console.error('Validation error creating first ID FormData:', validationError.message);
        throw new Error(`First ID validation failed: ${validationError.message}`);
      }
      
      console.log('Submitting first ID...');
      const firstIdResponse = await submitChildIdDocumentService(firstIdFormData);
      console.log('First ID submitted successfully:', firstIdResponse);
      responses.push({ type: 'firstId', success: true, data: firstIdResponse });

      // Submit Second ID if present
      if (currentChildIdData.hasSecondId && currentChildIdData.secondIdType) {
        let secondIdFormData;
        try {
          secondIdFormData = _createChildIdFormData(currentChildIdData, 'second', false);
        } catch (validationError) {
          console.error('Validation error creating second ID FormData:', validationError.message);
          throw new Error(`Second ID validation failed: ${validationError.message}`);
        }
        
        console.log('Submitting second ID...');
        const secondIdResponse = await submitChildIdDocumentService(secondIdFormData);
        console.log('Second ID submitted successfully:', secondIdResponse);
        responses.push({ type: 'secondId', success: true, data: secondIdResponse });
      }

      // Update demoStore with successfully submitted data (simplified, might need more detail from responses)
      demoStore.$patch({
        childIdInfo: {
          firstIdType: currentChildIdData.firstIdType,
          firstIdNumber: currentChildIdData.firstIdNumber,
          firstExpiryDate: currentChildIdData.firstExpiryDate,
          firstIdDocumentName: currentChildIdData.firstIdDocument?.map(f => f.name).join(', ') || null,
          hasSecondId: currentChildIdData.hasSecondId,
          secondIdType: currentChildIdData.hasSecondId ? currentChildIdData.secondIdType : null,
          secondIdNumber: currentChildIdData.hasSecondId ? currentChildIdData.secondIdNumber : null,
          secondExpiryDate: currentChildIdData.hasSecondId ? currentChildIdData.secondExpiryDate : null,
          secondIdDocumentName: currentChildIdData.hasSecondId && currentChildIdData.secondIdDocument?.length > 0 
                                ? currentChildIdData.secondIdDocument.map(f => f.name).join(', ') 
                                : null,
          holder_type: 'child',
        },
      });

      console.log('=== Child ID Submission Completed Successfully ===');
    } catch (error) {
      overallSuccess = false;
      console.error('Error submitting Child ID data via store:', error);
      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during Child ID submission.';
      const parsedFieldErrors = {}; // Errors might need prefixing (e.g., firstIdNumber, secondIdNumber)

      // Handle validation errors (thrown by our validation)
      if (error.message && !error.response) {
        generalError = error.message;
      } else if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              // Attempt to determine if it's for first or second ID based on context if possible, or map generally
              // This part is tricky if API doesn't distinguish which ID set had the error.
              // For now, general mapping.
              const formFieldKey = API_FIELD_MAPPING_CHILD_ID[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) { // This might overwrite if API returns same field name for both IDs
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
          // Simplified error handling for now
        }
      }
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors; 
      // Store partial successes if needed, or treat any error as full failure for this action
      responses.push({ type: 'error', success: false, error: error, generalMessage: generalError, fieldMessages: parsedFieldErrors });
    } finally {
      isLoading.value = false;
    }
    
    return { 
      success: overallSuccess,
      responses: responses, // Array of responses/errors for each part
      // Top-level error state for convenience, mirrors the last/primary error encountered
      generalMessage: apiSubmitError.value, 
      fieldMessages: apiFieldErrors.value 
    };
  };

  const submitBeneficiaryData = async (singleBeneficiaryData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {}; // Clear previous errors for this specific type of submission

    // Ensure signup_id is included
    const payload = {
      ...singleBeneficiaryData,
      signup_id: demoStore.signupId, // Get signup_id from demoStore
      // Ensure gender is lowercase as per original component logic if API expects it
      gender: singleBeneficiaryData.gender ? singleBeneficiaryData.gender.toLowerCase() : undefined,
      // Ensure middle_name is null if empty, as per original component logic
      middle_name: singleBeneficiaryData.middle_name || null,
      address_line_2: singleBeneficiaryData.address_line_2 || null,
    };

    try {
      const response = await submitBeneficiaryService(payload);
      // This action does not directly modify demoStore.beneficiaryInfo list.
      // The calling component/form manager will handle updating the local list and then demoStore.
      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error submitting beneficiary data via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during beneficiary submission.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_BENEFICIARY[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
          else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length && errorData.detail.length > 0) {
             generalError = errorData.detail.map(e => e.msg || 'Unknown error detail').join('; ');
          } else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length) {
            generalError = 'Failed to process beneficiary data due to validation issues.';
          }
        }
      } else if (error.message) {
        generalError = error.message;
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors; // These are specific to the current beneficiary form
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  const requestEmailVerificationCodeAction = async ({ signupId, email, operation }) => {
    isRequestingCode.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    try {
      console.log('Store: Requesting email verification code with:', {
        signupId,
        email,
        operation,
        isEmail: !!email
      });

      const identifier = email || signupId;
      const isEmail = !!email;

      if (!identifier) {
        throw new Error('Missing identifier: either signupId or email must be provided');
      }

      const response = await EmailVerificationApiService.sendVerificationCode(
        identifier,
        operation,
        isEmail
      );

      // EmailVerificationApiService now consistently returns response.data directly
      // Check if the response contains expected properties for a successful verification code request
      if (response && typeof response === 'object') {
        // Validate that we have the expected response structure
        const hasValidStructure = response.signup_id || response.email || response.identifier;
        
        if (hasValidStructure) {
      isRequestingCode.value = false;
          return {
            success: true,
            data: response,
            generalMessage: response.message || 'Verification code sent successfully!'
          };
        } else {
          console.error('Store: API response structure is unexpected - missing identifier fields:', response);
          isRequestingCode.value = false;
          const generalError = 'Received unexpected response format from verification service.';
          apiSubmitError.value = generalError;
          return { success: false, generalMessage: generalError };
        }
      } else {
        console.error('Store: API response is null, undefined, or not an object:', response);
        isRequestingCode.value = false;
        const generalError = 'Failed to get a valid response for sending verification code.';
        apiSubmitError.value = generalError;
        return { success: false, generalMessage: generalError };
      }

    } catch (error) {
      isRequestingCode.value = false;
      console.error('Error requesting email verification code via store:', error);
      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred while requesting the verification code.';
      
      if (errorData) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          generalError = errorData.detail.map(d => d.msg || d.message || 'Unknown error detail').join('; ') || generalError;
        } else if (typeof errorData.message === 'string') {
          generalError = errorData.message;
        } else if (typeof errorData === 'string') {
          generalError = errorData;
        }
      } else if (error.message) {
        generalError = error.message;
      } else {
        generalError = 'Network error or server unreachable. Please try again.';
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = {}; 
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: apiFieldErrors.value
      };
    }
  };

  const verifyEmailCodeAction = async ({ signupId, email, operation, code }) => {
    isLoading.value = true; // Use main loading state for verification submission
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    try {
      console.log('Store: Verifying email code with:', {
        signupId,
        email,
        operation,
        code,
        isEmail: !!email
      });

      const identifier = email || signupId;
      const isEmail = !!email;

      if (!identifier) {
        throw new Error('Missing identifier: either signupId or email must be provided');
      }

      const response = await EmailVerificationApiService.verifyCode(
        identifier,
        operation,
        code,
        isEmail
      );

      // Validate response structure
      if (response && typeof response === 'object') {
      // On success, update the demoStore
      demoStore.$patch({
        isEmailVerified: true,
        emailVerifiedOn: response.verified_on || new Date().toISOString(),
      });

      isLoading.value = false;
      return { success: true, data: response };
      } else {
        console.error('Store: Invalid verification response structure:', response);
        isLoading.value = false;
        const generalError = 'Received invalid response from verification service.';
        apiSubmitError.value = generalError;
        return { success: false, generalMessage: generalError };
      }
    } catch (error) {
      isLoading.value = false;
      console.error('Error verifying email code via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during email verification.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
          // Check if the error message implies it's about the code field
          if (generalError.toLowerCase().includes('code')) {
             parsedFieldErrors.verificationCode = generalError; // Map to form field
             generalError = ''; // Clear general if it's a field error
          }
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_EMAIL_VERIFICATION[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
        }
      } else if (error.message) {
         generalError = error.message;
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  const submitEmploymentData = async (currentEmploymentData, isChildAccountHolder) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    // Check what data we received
    console.log('Received employment data:', currentEmploymentData);
    console.log('Keys in employment data:', Object.keys(currentEmploymentData));
    console.log('Sample values:', {
      employer_name: currentEmploymentData.employer_name,
      occupation: currentEmploymentData.occupation,
      address_line_1: currentEmploymentData.address_line_1,
      city: currentEmploymentData.city,
      country: currentEmploymentData.country,
      employment_status: currentEmploymentData.employment_status,
      monthly_remuneration: currentEmploymentData.monthly_remuneration,
      value_of_assets: currentEmploymentData.value_of_assets,
      source_of_funds_type: currentEmploymentData.source_of_funds_type
    });

    const formData = new FormData();
    
    // Ensure signup_id exists
    if (!demoStore.signupId) {
      throw new Error('Missing signup_id - cannot submit employment data');
    }
    
    formData.append('signup_id', demoStore.signupId);
    formData.append('employer_name', currentEmploymentData.employer_name || '');
    formData.append('occupation', currentEmploymentData.occupation === 'Other' ? currentEmploymentData.custom_occupation : currentEmploymentData.occupation || '');
    formData.append('address_line_1', currentEmploymentData.address_line_1 || '');
    if (currentEmploymentData.address_line_2) {
      formData.append('address_line_2', currentEmploymentData.address_line_2);
    }
    formData.append('city', currentEmploymentData.city || '');
    formData.append('country', currentEmploymentData.country || '');
    formData.append('is_business_owner', String(currentEmploymentData.is_business_owner || false));
    if (currentEmploymentData.is_business_owner && currentEmploymentData.business_type) {
      formData.append('business_type', currentEmploymentData.business_type);
    }
    if (currentEmploymentData.nis_number) {
      formData.append('nis_number', currentEmploymentData.nis_number);
    }
    if (currentEmploymentData.bir_number) {
      formData.append('bir_number', currentEmploymentData.bir_number);
    }
    formData.append('monthly_remuneration', currentEmploymentData.monthly_remuneration || '');
    formData.append('value_of_assets', currentEmploymentData.value_of_assets || '');
    formData.append('employment_status', currentEmploymentData.employment_status || '');
    if (currentEmploymentData.work_phone) {
      formData.append('work_phone', currentEmploymentData.work_phone);
    }
    // Fix: API expects 'source_of_funds' not 'source_of_funds_type'
    formData.append('source_of_funds', currentEmploymentData.source_of_funds_type || '');

    if (isChildAccountHolder) {
      formData.append('child_account_contribution', currentEmploymentData.child_account_contribution || 'None');
      formData.append('child_account_contribution_amount', String(currentEmploymentData.child_account_contribution_amount || 0));
    } else {
      formData.append('child_account_contribution', 'None');
      formData.append('child_account_contribution_amount', '0');
    }

    if (currentEmploymentData.proof_of_employment_files && currentEmploymentData.proof_of_employment_files.length > 0) {
      for (const file of currentEmploymentData.proof_of_employment_files) {
        if (file instanceof File) {
          formData.append('proof_of_employment_files', file);
        }
      }
    }

    // Log FormData for debugging
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? `[File] ${value.name}` : value}`);
    }

    try {
      const response = await submitEmploymentInformationService(formData);
      
      // On success, update the demoStore
      if (demoStore.setEmploymentInfo) {
        demoStore.setEmploymentInfo(currentEmploymentData);
      } else {
         demoStore.$patch({ employmentInfo: { ...currentEmploymentData } });
      }
      // localStorage.removeItem('employmentFormData'); // Will be handled by form manager

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error submitting employment info via store:', error);
      
      // Log API errors
      if (error.response?.data?.detail) {
        console.error('API validation errors:', error.response.data.detail);
      }

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during employment information submission.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_EMPLOYMENT[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
          else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length && errorData.detail.length > 0) {
             generalError = errorData.detail.map(e => e.msg || 'Unknown error detail').join('; ');
          } else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length) {
            generalError = 'Failed to process employment information due to validation issues.';
          }
        }
      } else if (error.message) {
        generalError = error.message;
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  const submitForeignNationalBankData = async (currentBankData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    const payload = {
      signup_id: demoStore.signupId, // Assuming signupId is available in demoStore
      bank_name: currentBankData.bank_name,
      account_number: currentBankData.account_number,
      address_line_1: currentBankData.address_line_1,
      city: currentBankData.city,
      country: currentBankData.country,
      phone: currentBankData.phone,
      swift_code: currentBankData.swift_code || '', // Always include swift_code, even if empty
    };

    // Only include address_line_2 if it has a value
    if (currentBankData.address_line_2 && currentBankData.address_line_2.trim()) {
      payload.address_line_2 = currentBankData.address_line_2;
    }

    try {
      const response = await submitForeignNationalBankInfoService(payload);

      // On success, update the demoStore
      // The component uses store.foreignNationalInfo - let's assume demoStore has a similar structure or a setter.
      // We will map to the keys used in the component's onMounted/navigateToPrevious logic for consistency.
      const demoStorePayload = {
        bankName: currentBankData.bank_name,
        accountNumber: currentBankData.account_number, // original component cleans this, ensure payload matches API needs
        addressLine1: currentBankData.address_line_1,
        addressLine2: currentBankData.address_line_2,
        city: currentBankData.city,
        country: currentBankData.country,
        phone: currentBankData.phone,
        swiftCode: currentBankData.swift_code,
        signupId: demoStore.signupId, // Though this is already in demoStore
      };
      
      if (demoStore.setForeignNationalInfo) { // Ideal case: a dedicated setter
        demoStore.setForeignNationalInfo(demoStorePayload);
      } else { // Fallback: direct patch if demoStore allows it
        demoStore.$patch({ foreignNationalInfo: demoStorePayload });
      }
      // localStorage.removeItem('foreignBankFormData'); // Will be handled by form manager

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error submitting foreign national bank info via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during foreign bank information submission.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_FOREIGN_BANK[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
          else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length && errorData.detail.length > 0) {
             generalError = errorData.detail.map(e => e.msg || 'Unknown error detail').join('; ');
          } else if (!tempGeneralError && !Object.keys(parsedFieldErrors).length) {
            generalError = 'Failed to process foreign bank information due to validation issues.';
          }
        }
      } else if (error.message) {
        generalError = error.message;
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  const _createIdFormDataForApi = (idDataSet, idKeyPrefix, holderType, isPrimary) => {
    const formData = new FormData();
    formData.append('signup_id', demoStore.signupId);
    formData.append('holder_type', holderType);
    formData.append('id_type', idDataSet[`${idKeyPrefix}IdType`]);
    formData.append('id_number', idDataSet[`${idKeyPrefix}IdNumber`]);
    formData.append('id_expiry_date', idDataSet[`${idKeyPrefix}ExpiryDate`]);
    formData.append('is_primary_id', String(isPrimary));

    // The schema and form manager expect documents to be an array of File objects.
    // The current schema for id-information-schema.js expects .max(1) file.
    const documentFile = idDataSet[`${idKeyPrefix}IdDocument`]?.[0];
    if (documentFile instanceof File) {
      formData.append('id_files', documentFile);
    }
    return formData;
  };

  const submitIdInformationData = async (currentIdData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {}; // Clear previous errors
    let overallSuccess = true;
    let responses = [];

    const age = calculateAgeUtility(demoStore.dob); // Assuming demoStore.dob is populated from BasicInfo
    const holderType = age >= 18 ? 'self' : 'guardian';

    try {
      // Submit First ID (Primary)
      const firstIdApiFormData = _createIdFormDataForApi(currentIdData, 'first', holderType, true);
      const firstIdResponse = await submitChildIdDocumentService(firstIdApiFormData); // Reusing service
      responses.push({ type: 'firstId', success: true, data: firstIdResponse });

      // Submit Second ID (Secondary)
      if (currentIdData.secondIdType && currentIdData.secondIdNumber) { // Only submit if data is provided
      const secondIdApiFormData = _createIdFormDataForApi(currentIdData, 'second', holderType, false);
      const secondIdResponse = await submitChildIdDocumentService(secondIdApiFormData); // Reusing service
      responses.push({ type: 'secondId', success: true, data: secondIdResponse });
      }


      // Update demoStore
      // This structure should align with what the composable expects for loading from demoStore
      demoStore.$patch({
        idInformation: {
          firstIdType: currentIdData.firstIdType,
          firstIdNumber: currentIdData.firstIdNumber,
          firstExpiryDate: currentIdData.firstExpiryDate,
          firstIdDocumentName: currentIdData.firstIdDocument?.[0]?.name || null,
          secondIdType: currentIdData.secondIdType,
          secondIdNumber: currentIdData.secondIdNumber,
          secondExpiryDate: currentIdData.secondExpiryDate,
          secondIdDocumentName: currentIdData.secondIdDocument?.[0]?.name || null,
          holderType: holderType, // Store the determined holder type
        },
      });

    } catch (error) {
      overallSuccess = false;
      console.error('Error submitting ID Information data via store:', error);
      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during ID Information submission.';
      const parsedFieldErrors = {}; 

      // Basic error handling, similar to submitChildIdData. 
      // API errors might not distinguish between first/second ID fields without careful API design.
      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              // This mapping is generic. If API returns e.g. 'id_number' error, it's hard to know if it's for first or second.
              // The form manager might need to handle or display this generically, or errors could be prefixed by API.
              const formFieldKey = API_FIELD_MAPPING_ID_INFORMATION[apiFieldKey] || apiFieldKey;
              parsedFieldErrors[formFieldKey] = (parsedFieldErrors[formFieldKey] ? parsedFieldErrors[formFieldKey] + "; " : "") + err.msg;
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
        }
      }
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors; 
      responses.push({ type: 'error', success: false, error: error, generalMessage: generalError, fieldMessages: parsedFieldErrors });
    } finally {
      isLoading.value = false;
    }
    
    return { 
      success: overallSuccess,
      responses: responses,
      generalMessage: apiSubmitError.value, 
      fieldMessages: apiFieldErrors.value 
    };
  };

  const submitMailingAddressData = async (currentMailingAddressData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    if (currentMailingAddressData.sameAsResidential) {
      // Update demoStore with the "same as residential" status and potentially copied data
      // The original component stores specific fields even if sameAsResidential is true,
      // but proofOfAddressFiles and dwellingStatus are null.
      // Get residential address info from demoStore.addressInfo
      const residential = demoStore.addressInfo || {};
      demoStore.$patch({
        mailingAddressInfo: {
        sameAsResidential: true,
        address_line_1: residential.addressLine1 || '', // from demoStore structure
        address_line_2: residential.addressLine2 || '',
        city: residential.city || '',
        country: residential.country || '',
        // dwelling_status: null, // Not typically part of mailing address schema directly
        proof_of_address_files: null, // Files are not submitted
        }
      });
      
      localStorage.removeItem('mailingAddressFormData'); // Clear persisted form data

      // Navigation logic based on nationality
      if (demoStore.getNationality === 'Trinidad and Tobago') {
        router.push('/employment-information');
      } else {
        router.push('/foreign-national-bank-information');
      }
      isLoading.value = false;
      return { success: true };
    }

    // If not same as residential, proceed with API submission
    const formDataForApi = new FormData();
    formDataForApi.append('signup_id', demoStore.signupId || ''); // Ensure signupId is available
    formDataForApi.append('address_line_1', currentMailingAddressData.address_line_1);
    formDataForApi.append('address_line_2', currentMailingAddressData.address_line_2 || '');
    formDataForApi.append('city', currentMailingAddressData.city);
    formDataForApi.append('country', currentMailingAddressData.country);
    formDataForApi.append('address_type', 'mailing'); // Explicitly set by service, but good to be clear
    formDataForApi.append('dwelling_status', 'null'); // As per original component

    if (currentMailingAddressData.proof_of_address_files && currentMailingAddressData.proof_of_address_files.length > 0) {
      for (const file of currentMailingAddressData.proof_of_address_files) {
        if (file instanceof File) {
          formDataForApi.append('proof_of_address_files', file);
        }
      }
    }

    try {
      const response = await submitMailingAddressService(formDataForApi);
      
      demoStore.$patch({
        mailingAddressInfo: {
        ...currentMailingAddressData, // Contains all form fields including sameAsResidential = false
        // Ensure file objects are not directly stored if demoStore expects different format;
        // original component stored the FileList/File object.
        }
      });
      localStorage.removeItem('mailingAddressFormData');

      // Navigation logic based on nationality
      if (demoStore.getNationality === 'Trinidad and Tobago') {
        router.push('/employment-information');
      } else {
        router.push('/foreign-national-bank-information');
      }

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error submitting mailing address via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during mailing address submission.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_MAILING_ADDRESS[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError) generalError = tempGeneralError;
        }
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;
      
      return { 
        success: false, 
        error: error,
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  // Action for sending mobile verification code
  const sendMobileVerificationCodeAction = async () => {
    isSendingMobileCode.value = true;
    apiSubmitError.value = null; // Clear previous general errors
    apiFieldErrors.value = {}; // Clear previous field errors

    if (!demoStore.signupId) {
      console.error('Signup ID is missing for sending mobile verification code.');
      apiSubmitError.value = 'Signup ID is missing. Cannot send verification code.';
      isSendingMobileCode.value = false;
      return { 
        success: false, 
        generalMessage: apiSubmitError.value,
        fieldMessages: {}
      };
    }

    try {
      const response = await MobileVerificationApiService.sendVerificationCode(demoStore.signupId);
      isSendingMobileCode.value = false;
      // Optionally, handle success message or specific data from response if needed
      return { success: true, data: response };
    } catch (error) {
      isSendingMobileCode.value = false;
      console.error('Error sending mobile verification code via store:', error);
      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred while sending the mobile verification code.';
      
      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else {
          generalError = 'Failed to send mobile verification code. Please try again.';
        }
      } else if (error.message) {
        generalError = error.message;
      }
      
      apiSubmitError.value = generalError;
      // No specific field errors expected for sending code, but clear to be safe
      apiFieldErrors.value = {}; 
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: {} 
      };
    }
  };

  // Action for verifying mobile code
  const verifyMobileCodeAction = async (verificationCode) => {
    isLoading.value = true; // Use general loading for submission type actions
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    if (!demoStore.signupId) {
      console.error('Signup ID is missing for mobile code verification.');
      apiSubmitError.value = 'Signup ID is missing. Cannot verify code.';
      isLoading.value = false;
      return { 
        success: false, 
        generalMessage: apiSubmitError.value,
        fieldMessages: {}
      };
    }

    try {
      const response = await MobileVerificationApiService.verifyCode(demoStore.signupId, verificationCode);
      
      // On success, update the demoStore
      demoStore.$patch({
        isMobileVerified: true,
        mobileVerifiedOn: response.verified_on || new Date().toISOString(),
      });
      // Potentially clear any related localStorage if form manager uses it for this form
      // localStorage.removeItem('mobileVerificationFormData'); 

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error verifying mobile code via store:', error);

      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during mobile verification.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
          // Check if the error message implies it's about the code field
          if (generalError.toLowerCase().includes('code') || generalError.toLowerCase().includes('verification')) {
             parsedFieldErrors.verificationCode = generalError; // Map to form field
             generalError = ''; // Clear general if it's a field error
          }
        } else if (Array.isArray(errorData.detail)) {
          let tempGeneralError = '';
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const apiFieldKey = err.loc[1];
              const formFieldKey = API_FIELD_MAPPING_MOBILE_VERIFICATION[apiFieldKey] || apiFieldKey;
              if (!parsedFieldErrors[formFieldKey]) {
                parsedFieldErrors[formFieldKey] = err.msg;
              }
            } else if (err.msg) {
              tempGeneralError = tempGeneralError ? `${tempGeneralError}; ${err.msg}` : err.msg;
            }
          });
          if (tempGeneralError && !Object.keys(parsedFieldErrors).length) generalError = tempGeneralError;
        }
      } else if (error.message) {
         generalError = error.message;
      }
      
      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;
      
      return { 
        success: false, 
        error: error, 
        generalMessage: generalError,
        fieldMessages: parsedFieldErrors 
      };
    }
  };

  // Actions for setting customer type
  const setCustomerAsNew = () => {
    demoStore.setCustomerType('new');
    demoStore.setNewCustomer(true);
    demoStore.setExistingCustomer(false);
    // router.push('/getting-ready'); // Navigation will be handled by the component after action call
  };

  const setCustomerAsExisting = () => {
    demoStore.setCustomerType('existing');
    demoStore.setNewCustomer(false);
    demoStore.setExistingCustomer(true);
    // router.push('/getting-ready'); // Navigation will be handled by the component
  };

  const initializeCustomerType = () => {
    if (!demoStore.customerType) {
      demoStore.setCustomerType(null);
      demoStore.setNewCustomer(false);
      demoStore.setExistingCustomer(false);
    }
  };

  const submitMembershipDeclaration = async (declarationData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    const signupValidation = validateSignupId(demoStore.signupId);
    if (!signupValidation.success) {
      isLoading.value = false;
      apiSubmitError.value = signupValidation.generalMessage;
      return signupValidation;
    }

    const payload = {
      signup_id: demoStore.signupId,
      is_member_of_another_credit_union: declarationData.isMemberOfAnotherCreditUnion === 'yes',
      credit_union_name: declarationData.isMemberOfAnotherCreditUnion === 'yes' ? (declarationData.creditUnionName || '') : '',
      is_serving_on_credit_union_board: declarationData.isServingOnBoard === 'yes',
      board_credit_union_name: declarationData.isServingOnBoard === 'yes' ? (declarationData.creditUnionBoardName || '') : '',
    };

    try {
      const response = await MembershipApiService.submitMembershipDeclaration(payload);

      demoStore.$patch({
        membershipInfo: {
          isMemberOfAnotherCreditUnion: declarationData.isMemberOfAnotherCreditUnion,
          creditUnionName: declarationData.isMemberOfAnotherCreditUnion === 'yes' ? declarationData.creditUnionName : '',
          isServingOnBoard: declarationData.isServingOnBoard,
          creditUnionBoardName: declarationData.isServingOnBoard === 'yes' ? declarationData.creditUnionBoardName : '',
        },
      });

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      const errorResult = handleApiError(error, 'Membership', API_FIELD_MAPPINGS.MEMBERSHIP_DECLARATION);
      apiSubmitError.value = errorResult.generalMessage;
      apiFieldErrors.value = errorResult.fieldMessages;
      return errorResult;
    }
  };

  const submitPepDataAction = async (pepFormData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    const signupValidation = validateSignupId(demoStore.signupId);
    if (!signupValidation.success) {
      isLoading.value = false;
      apiSubmitError.value = signupValidation.generalMessage;
      return signupValidation;
    }

    const payload = {
      signup_id: demoStore.signupId,
      is_pep: pepFormData.isPEP,
      job_title: pepFormData.isPEP ? (pepFormData.jobTitle || '') : '',
      domestic_foreign_roles: pepFormData.isPEP ? (pepFormData.domestic_foreign_roles || []) : [],
      international_roles: pepFormData.isPEP ? (pepFormData.international_roles || []) : [],
      immediate_family_members: pepFormData.isPEP ? (pepFormData.immediate_family_members || []) : [],
      is_close_associate: pepFormData.is_close_associate === 'yes',
      relationship_type: pepFormData.is_close_associate === 'yes' ? (pepFormData.relationship_type || '') : '',
      associate_name: pepFormData.is_close_associate === 'yes' ? (pepFormData.associate_name || '') : '',
      is_confirmed: true,
    };

    try {
      const response = await submitPepDataService(payload);

      demoStore.$patch({
        pepInfo: {
          isPEP: pepFormData.isPEP,
          jobTitle: pepFormData.jobTitle,
          domestic_foreign_roles: pepFormData.domestic_foreign_roles,
          international_roles: pepFormData.international_roles,
          immediate_family_members: pepFormData.immediate_family_members,
          is_close_associate: pepFormData.is_close_associate,
          relationship_type: pepFormData.relationship_type,
          associate_name: pepFormData.associate_name,
        },
      });

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      const errorResult = handleApiError(error, 'PEP', API_FIELD_MAPPINGS.PEP);
      apiSubmitError.value = errorResult.generalMessage;
      apiFieldErrors.value = errorResult.fieldMessages;
      return errorResult;
    }
  };

  // ADDED submitPowerOfAttorneyAction
  const submitPowerOfAttorneyAction = async (poaFormDataFromManager) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    const signupValidation = validateSignupId(demoStore.signupId);
    if (!signupValidation.success) {
      isLoading.value = false;
      apiSubmitError.value = signupValidation.generalMessage;
      return signupValidation;
    }

    try {
      // Helper to normalize chosen file value (File | File[] | undefined)
      const pickFile = (fileLike) => {
        if (!fileLike) return null;
        if (fileLike instanceof File) return fileLike;
        if (Array.isArray(fileLike) && fileLike.length) return fileLike[0];
        return null;
      };

      const idDocFile = pickFile(poaFormDataFromManager.id_document);
      const poaDocFile = pickFile(poaFormDataFromManager.power_of_attorney_document);

      // Validate presence - at least one file is required
      if (!idDocFile && !poaDocFile) {
        throw {
          detail: [{
            loc: ['body', 'power_of_attorney_files'],
            msg: 'At least one document (ID or Power of Attorney) is required',
            type: 'value_error.missing',
          }],
        };
      }

      // Create FormData for submission to main endpoint
      const formDataApi = new FormData();
      formDataApi.append('signup_id', demoStore.signupId);
      
      // Append text fields - map from form field names to API field names
      for (const key in poaFormDataFromManager) {
        if (key !== 'id_document' && key !== 'power_of_attorney_document') {
          const value = poaFormDataFromManager[key];
          formDataApi.append(key, value === null || typeof value === 'undefined' ? '' : value);
        }
      }

      // Append both files to the power_of_attorney_files field as expected by backend
      if (idDocFile) {
        formDataApi.append('power_of_attorney_files', idDocFile, idDocFile.name);
      }

      if (poaDocFile) {
        formDataApi.append('power_of_attorney_files', poaDocFile, poaDocFile.name);
      }

      const response = await submitPowerOfAttorneyDataService(formDataApi);

      // Update demoStore with POA information
      const poaInfoForStore = { ...poaFormDataFromManager };
      delete poaInfoForStore.id_document;
      delete poaInfoForStore.power_of_attorney_document;
      
      demoStore.$patch({ powerOfAttorneyInfo: poaInfoForStore });

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      const errorResult = handleApiError(error, 'Power of Attorney', API_FIELD_MAPPINGS.POWER_OF_ATTORNEY);
      apiSubmitError.value = errorResult.generalMessage;
      apiFieldErrors.value = errorResult.fieldMessages;
      return errorResult;
    }
  };

  // ADDED Action to handle skipping Power of Attorney
  const skipPowerOfAttorneyAction = () => {
    demoStore.$patch({ hasPowerOfAttorney: false, powerOfAttorneySkipped: true });
    // Navigation will be handled by the component after this action call
    // No API call is made, just updating the state.
  };

  const verifyAccountNumberAction = async (accountNumberData) => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};

    try {
      const response = await verifyAccountNumberService(
        accountNumberData.account_number,
        demoStore.signupId
      );

      // On success, update the demoStore
      demoStore.setAccountNumber(accountNumberData.account_number);

      isLoading.value = false;
      return { success: true, data: response };
    } catch (error) {
      isLoading.value = false;
      console.error('Error verifying account number via store:', error);

      // This part depends on the actual error structure from the API
      // For now, we'll assume a similar structure to other actions.
      const errorData = error.response?.data;
      let generalError = 'An unexpected error occurred during account number verification.';
      const parsedFieldErrors = {};

      if (errorData && errorData.detail) {
        if (typeof errorData.detail === 'string') {
          generalError = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Handle validation errors (e.g., from DRF)
          errorData.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const fieldName = err.loc[1];
              // This is a basic mapping, you might need a more complex one
              if (fieldName === 'account_number') {
                parsedFieldErrors.account_number = err.msg;
              }
            }
          });
          generalError = 'Please correct the errors below.';
        }
      } else {
        generalError = error.message;
      }

      apiSubmitError.value = generalError;
      apiFieldErrors.value = parsedFieldErrors;

      return {
        success: false,
        generalMessage: apiSubmitError.value,
        fieldMessages: apiFieldErrors.value,
      };
    }
  };

  const finalizeOnboarding = async () => {
    isLoading.value = true;
    apiSubmitError.value = null;
    apiFieldErrors.value = {};
    
    try {
      // In a real scenario, you might want to gather all data from demoStore
      // and send it. For this refactor, we'll mimic the old logic which
      // didn't pass much data. The service is a placeholder.
      const response = await createFinalAccountService(demoStore.$state);

      // Potentially clear the demoStore after successful finalization
      // demoStore.clearAll();

      isLoading.value = false;
      return { success: true, data: response };

    } catch (error) {
      isLoading.value = false;
      console.error('Error finalizing onboarding:', error);
      apiSubmitError.value = error.message || 'An unexpected error occurred during account finalization.';
      
      return { 
        success: false, 
        generalMessage: apiSubmitError.value 
      };
    }
  };

  return {
    isLoading,
    isRequestingCode,
    isSendingMobileCode, // expose new state
    apiSubmitError,
    apiFieldErrors,
    submitAddressData,
    submitBasicInfoFormData,
    submitBranchData,
    submitChildIdData,
    submitBeneficiaryData,
    requestEmailVerificationCodeAction,
    verifyEmailCodeAction,
    submitEmploymentData,
    submitForeignNationalBankData,
    submitIdInformationData,
    submitMailingAddressData,
    sendMobileVerificationCodeAction, // expose new action
    verifyMobileCodeAction,     // expose new action
    setCustomerAsNew,     // expose new action
    setCustomerAsExisting,    // expose new action
    initializeCustomerType,     // expose new action
    submitMembershipDeclaration,    // expose new action
    submitPepDataAction,      // ADDED
    submitPowerOfAttorneyAction,      // ADDED
    skipPowerOfAttorneyAction,      // ADDED
    verifyAccountNumberAction,      // ADDED
    finalizeOnboarding,
  };
}); 
