import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { addressSchema } from '@/features/onboarding/schemas/address-schema.js';

const LOCAL_STORAGE_KEY = 'addressFormData';

// This mapping is used by parseAndSetApiErrors to map API response fields to form fields.
const API_ERROR_FIELD_MAPPING = {
  address_line_1: 'addressLine1',
  address_line_2: 'addressLine2',
  city: 'city',
  country: 'country',
  dwelling_status: 'dwellingStatus',
  utility_bill_type: 'utilityBillType',
  proof_of_address_files: 'proofOfAddress',
};

export function useAddressFormManager() {
  const formData = ref({
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    dwellingStatus: '',
    utilityBillType: '',
    proofOfAddress: [],
  });

  const {
    errors: fieldErrors,       // For Zod field-specific errors
    serverError: formAlertError, // For general errors displayed in a v-alert
    validate,                 // Zod full form validation function
    parseApiErrors: zodParseApiErrors, // Raw parseApiErrors from useSimpleFormValidation
    clearErrors               // Clears Zod errors and formAlertError
  } = useSimpleFormValidation(addressSchema);

  const componentMounted = ref(true);
  let initialFormStateForUnloadCheck = ''; 
  const loadFormState = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        formData.value = {
          ...formData.value, 
          ...parsedData,
          proofOfAddress: parsedData.proofOfAddress || [], 
        };
      } catch (e) {
        console.error('Error parsing addressFormData from localStorage:', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
      }
    }
    initialFormStateForUnloadCheck = JSON.stringify(formData.value);
  };

  const saveFormState = () => {
    if (componentMounted.value) { // Only save if component is active
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData.value));
    }
  };

  const clearPersistedFormState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Reset form data to initial state after successful submission and clearing persistence
    formData.value = {
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        dwellingStatus: '',
        utilityBillType: '',
        proofOfAddress: [],
    };
    initialFormStateForUnloadCheck = JSON.stringify(formData.value); // Update for unload check
  };

  watch(formData, saveFormState, { deep: true });

  const hasUnsavedChanges = () => {
    return JSON.stringify(formData.value) !== initialFormStateForUnloadCheck;
  };

  const handleBeforeUnload = (event) => {
    if (hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = ''; // Standard for most browsers to show a generic prompt
    }
  };

  onMounted(() => {
    componentMounted.value = true;
    loadFormState();
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    componentMounted.value = false;
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  const validateFormField = async (fieldName) => {
    try {
      await addressSchema.pick({ [fieldName]: true }).parseAsync({ [fieldName]: formData.value[fieldName] });
      if (fieldErrors.value[fieldName]) {
        delete fieldErrors.value[fieldName];
        fieldErrors.value = { ...fieldErrors.value };
      }
      return true;
    } catch (error) {
      if (error.issues && error.issues.length > 0) {
        fieldErrors.value = { ...fieldErrors.value, [fieldName]: error.issues[0].message };
      } else {
         if (fieldErrors.value[fieldName]) {
            delete fieldErrors.value[fieldName];
            fieldErrors.value = { ...fieldErrors.value };
        }
      }
      return false;
    }
  };

  // Wrapper for parseApiErrors from useSimpleFormValidation, using the predefined mapping
  const parseAndSetApiErrors = (errorResponseData) => {
    return zodParseApiErrors(errorResponseData, API_ERROR_FIELD_MAPPING);
  };

  return {
    formData,
    fieldErrors,
    formAlertError, // This will be used for the v-alert in the component
    validate,          // Full form Zod validation
    validateFormField, // Individual field Zod validation
    clearErrors,       // Clears Zod fieldErrors and formAlertError
    parseAndSetApiErrors, // To process API error messages into fieldErrors and formAlertError
    clearPersistedFormState, // To call on successful submission
    // componentMounted, // Not typically needed by the component directly
    // hasUnsavedChanges, // Expose if needed for more granular control in component
  };
} 