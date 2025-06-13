import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { createEmploymentSchema } from '@/features/onboarding/schemas/employment-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore'; 
import {
  OCCUPATIONS,
  BUSINESS_TYPES,
  DISPLAY_EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS_RAW, // For validation and logic
  MONTHLY_REMUNERATION_OPTIONS,
  VALUE_OF_ASSETS_OPTIONS,
  CHILD_CONTRIBUTION_OPTIONS,
  SOURCE_OF_FUNDS_OPTIONS
} from '@/features/onboarding/constants/employment-options.js';
import { countryList as COUNTRY_LIST_OBJECTS } from '@/features/onboarding/constants/address-options.js'; // countryList is {name, code}

const LOCAL_STORAGE_KEY = 'employmentFormData';

// API error field mapping for proper error handling
const API_ERROR_FIELD_MAPPING = {
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
  source_of_funds: 'source_of_funds_type',
  source_of_funds_type: 'source_of_funds_type',
  proof_of_employment_files: 'proof_of_employment_files',
  is_business_owner: 'is_business_owner',
};

export function useEmploymentFormManager(isChildAccountHolder) {
  const router = useRouter();
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  const initialFormData = {
    is_business_owner: false,
    employment_status: '',
    employer_name: '',
    occupation: '',
    custom_occupation: '',
    business_type: '',
    work_phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    country: '', // Expecting country code
    nis_number: '',
    bir_number: '',
    monthly_remuneration: '',
    value_of_assets: '',
    child_account_contribution: '',
    child_account_contribution_amount: null,
    source_of_funds_type: '',
    proof_of_employment_files: [],
  };

  const formData = ref({ ...initialFormData });
  const formKey = ref(Date.now()); // To force re-render of file input if needed

  const { 
    errors: fieldErrors, 
    serverError: formAlertError, 
    validate, 
    parseApiErrors: zodParseApiErrors, 
    clearErrors 
  } = useSimpleFormValidation(createEmploymentSchema(false));
  
  // Create a custom validate function that uses the appropriate schema
  const validateForm = async (formData) => {
    const schema = createEmploymentSchema(isChildAccountHolder.value);
    fieldErrors.value = {}; // Clear previous client-side errors
    formAlertError.value = ''; // Clear previous server error

    const result = await schema.safeParseAsync(formData);

    if (!result.success) {
      const newErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.'); // Zod paths are typically direct field names
        if (!newErrors[path]) { // Only take the first error for a given path
          newErrors[path] = issue.message;
        }
      }
      fieldErrors.value = newErrors;
      return { isValid: false, errors: newErrors };
    }
    return { isValid: true, errors: {} };
  };

  /**
   * Parses and sets API errors using the field mapping
   * @param {Object} errorResponseData - Error response from API
   * @returns {Object} Parsed errors object
   */
  const parseAndSetApiErrors = (errorResponseData) => {
    return zodParseApiErrors(errorResponseData, API_ERROR_FIELD_MAPPING);
  };

  // Create a separate ref for server field errors from the store
  const serverErrors = ref({});

  // Constants for the template
  const countryList = computed(() => COUNTRY_LIST_OBJECTS.map(c => ({ title: c.name, value: c.code })));
  const occupations = computed(() => OCCUPATIONS);
  const businessTypes = computed(() => BUSINESS_TYPES);
  const displayEmploymentOptions = computed(() => DISPLAY_EMPLOYMENT_STATUS_OPTIONS);
  const remunerationOptions = computed(() => MONTHLY_REMUNERATION_OPTIONS);
  const assetValueOptions = computed(() => VALUE_OF_ASSETS_OPTIONS);
  const childContributionOptions = computed(() => CHILD_CONTRIBUTION_OPTIONS);
  const sourceOfFundsOptions = computed(() => SOURCE_OF_FUNDS_OPTIONS);

  const isLoading = computed(() => onboardingStore.isLoading);
  const formSubmitError = computed(() => onboardingStore.apiSubmitError);
  // Expose serverErrors (populated by onboardingStore.apiFieldErrors)
  watch(() => onboardingStore.apiFieldErrors, (newErrors) => {
    serverErrors.value = newErrors || {};
  });

  // Load from localStorage and demoStore on mount
  onMounted(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure files are not loaded from localStorage as they are not serializable properly
        parsedData.proof_of_employment_files = []; 
        formData.value = { ...initialFormData, ...parsedData };
      } catch (e) {
        console.warn('Could not parse employment form data from localStorage', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Sync with demoStore if it has data (e.g., user navigating back)
    if ((demoStore as any).employmentInfo) {
        const demoStoreData = { ...(demoStore as any).employmentInfo };
        // Again, ensure files are not part of this merge if they were stored as non-File objects
        delete demoStoreData.proof_of_employment_files; 
        formData.value = { ...formData.value, ...demoStoreData };
    }
    
    // Initial check for employment status if business owner is true
    if (formData.value.is_business_owner) {
      formData.value.employment_status = 'self-employed';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  // Watch for changes in employment status
  watch(() => formData.value.employment_status, (newStatus) => {
    if (newStatus !== 'self-employed' && newStatus !== 'employed') { // Or any status that implies not a business owner
        formData.value.is_business_owner = false;
    }
    // If they select 'self-employed', we can imply is_business_owner true
    if (newStatus === 'self-employed'){
        formData.value.is_business_owner = true;
    }
  });

  // Watch for changes in is_business_owner
  watch(() => formData.value.is_business_owner, (isBusinessOwner) => {
    if (isBusinessOwner) {
      if (formData.value.employment_status !== 'self-employed') {
         formData.value.employment_status = 'self-employed';
      }
    } else {
      // If they uncheck business owner, and status is self-employed, clear status or set to employed?
      // For now, let's not auto-change from self-employed if unchecked, user might be correcting.
      // But ensure business_type is cleared if not a business owner
      formData.value.business_type = '';
    }
  });

  // Persist to localStorage
  watch(formData, (newData) => {
    // Create a serializable version of the data (excluding actual File objects)
    const dataToSave = { ...newData };
    delete dataToSave.proof_of_employment_files; // Don't save File objects
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, { deep: true });

  const handleBeforeUnload = (event) => {
    // Basic check if form is dirty, can be enhanced
    if (JSON.stringify(formData.value) !== JSON.stringify(initialFormData)) {
      event.preventDefault();
      event.returnValue = ''; // Standard for most browsers
    }
  };

  const handleSubmit = async () => {
    // Validate entire form using schema validation
    const validationResult = await validateForm(formData.value);
    if (!validationResult.isValid) {
      return; // Stop submission if validation fails
    }

    try {
      // Submit form data to the onboarding store/API
      const storeSubmissionResult = await onboardingStore.submitEmploymentData(formData.value, isChildAccountHolder.value);

      if (storeSubmissionResult.success) {
        // Clear persisted form data after successful submission
      localStorage.removeItem(LOCAL_STORAGE_KEY);
        
        // Navigate to next step
        router.push('/designation-of-beneficiary');
      } else {
        // Handle submission errors using proper API error parsing
        // Clear any existing client-side validation errors first
        clearErrors("");

        // Parse and set backend errors using the form manager's API error parser
        if (storeSubmissionResult.error && storeSubmissionResult.error.response) {
          parseAndSetApiErrors(storeSubmissionResult.error.response.data);
        } else {
          // Handle cases where we have parsed errors from the store
          if (storeSubmissionResult.fieldMessages) {
            // Manually set field errors if they're already parsed
            Object.keys(storeSubmissionResult.fieldMessages).forEach((fieldName) => {
              fieldErrors.value = {
                ...fieldErrors.value,
                [fieldName]: storeSubmissionResult.fieldMessages[fieldName],
              };
            });
          }

          if (storeSubmissionResult.generalMessage) {
            formAlertError.value = storeSubmissionResult.generalMessage;
          } else if (!Object.keys(storeSubmissionResult.fieldMessages || {}).length) {
            formAlertError.value = 'An unexpected error occurred during employment information submission.';
          }
        }
      }
    } catch (error) {
      // Handle unexpected errors during submission
      console.error('Unexpected error during form submission:', error);

      // Clear any existing errors first
      clearErrors("");

      // Try to parse API errors from the caught error
      if (error.response && error.response.data) {
        parseAndSetApiErrors(error.response.data);
    } else {
        // Fallback to generic error message
        formAlertError.value = 'A system error occurred. Please try again later.';
      }
    }
  };
  
  const handleFileUpload = (files) => {
    formData.value.proof_of_employment_files = Array.isArray(files) ? files : (files ? [files] : []);
  };

  const clearFileSelection = () => {
    formData.value.proof_of_employment_files = [];
    formKey.value = Date.now(); // This can be bound to v-file-input key to force re-render
  };

  return {
    formData,
    errors: fieldErrors, // Zod validation errors
    serverErrors, // API field errors from store
    formSubmitError, // General API submission error from store
    isLoading,
    validate: validateForm,
    clearErrors,
    handleSubmit,
    handleFileUpload,
    clearFileSelection, // If manual clear is needed
    formKey, // For v-file-input re-rendering

    // Constants for the template
    countryList,
    occupations,
    businessTypes,
    displayEmploymentOptions,
    remunerationOptions,
    assetValueOptions,
    childContributionOptions,
    sourceOfFundsOptions,
    EMPLOYMENT_STATUS_OPTIONS_RAW, // For direct use if needed
    isChildAccountHolder,
    parseAndSetApiErrors
  };
} 
