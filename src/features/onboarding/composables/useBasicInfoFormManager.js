import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { basicInfoSchema } from '@/features/onboarding/schemas/basic-info-schema.js';
import { useDemoStore } from '@/store/demoStore';

// Constants
const LOCAL_STORAGE_KEY = 'basicInfoFormData';

// Centralized field definitions to avoid duplication and ensure consistency
const FORM_FIELDS = {
  firstName: '',
  lastName: '',
  otherName: '',
  email: '',
  mobileNumber: '',
  gender: '',
  dob: '',
  isHomeschooled: false,
  schoolName: null,
  hasForeignBankAccount: false,
  nationality: '',
  maritalStatus: '',
  password: '',
  confirmPassword: '',
  termsViewed: false,
  financialAgreementViewed: false,
};

// Mapping between API field names and form field names for error handling
const API_ERROR_FIELD_MAPPING = {
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
};

/**
 * Composable for managing basic info form state, validation, and persistence
 * Handles form data, localStorage persistence, demo store synchronization, and validation
 */
export function useBasicInfoFormManager() {
  // Initialize demo store for data synchronization
  const demoStore = useDemoStore();

  // Initialize form data with default values
  const formData = ref({ ...FORM_FIELDS });

  // Initialize form validation composable with schema
  const {
    errors: fieldErrors,
    serverError: formAlertError,
    validate,
    parseApiErrors: zodParseApiErrors,
    clearErrors
  } = useSimpleFormValidation(basicInfoSchema);

  // Track component mount state for conditional operations
  const componentMounted = ref(true);
  
  // Store initial form state for unsaved changes detection
  let initialFormStateForUnloadCheck = JSON.stringify(formData.value);

  // Helper Functions
  
  /**
   * Synchronizes data between form and demo store
   * @param {Object} source - Source object to copy from
   * @param {Object} target - Target object to copy to
   */
  const syncWithDemoStore = (source, target) => {
    Object.keys(FORM_FIELDS).forEach(key => {
      if (source[key] !== undefined) {
        target[key] = source[key];
      }
    });
  };

  /**
   * Loads form state from localStorage or demo store
   * Priority: localStorage > demo store > default values
   */
  const loadFormState = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedData) {
      // Load from localStorage if available
      try {
        const parsedData = JSON.parse(savedData);
        formData.value = { ...FORM_FIELDS, ...parsedData };
      } catch (error) {
        console.error('Error parsing basicInfoFormData from localStorage:', error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        // Fall back to default values if localStorage is corrupted
        formData.value = { ...FORM_FIELDS };
      }
    } else if (demoStore.isDataLoaded) {
      // Load from demo store if localStorage is empty but demo store has data
      const demoData = {};
      Object.keys(FORM_FIELDS).forEach(key => {
        if (demoStore[key] !== undefined) {
          demoData[key] = demoStore[key] || FORM_FIELDS[key];
        }
      });
      formData.value = { ...FORM_FIELDS, ...demoData };
    }
    
    // Update initial state for unsaved changes detection
    initialFormStateForUnloadCheck = JSON.stringify(formData.value);
  };

  /**
   * Saves current form state to localStorage and demo store
   * Only saves if component is still mounted to avoid memory leaks
   */
  const saveFormState = () => {
    if (componentMounted.value) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData.value));
      syncWithDemoStore(formData.value, demoStore);
    }
  };

  /**
   * Clears all persisted form data from localStorage and demo store
   * Resets form to default values
   */
  const clearPersistedFormState = () => {
    // Remove from localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    // Reset form data to defaults
    formData.value = { ...FORM_FIELDS };
    
    // Clear demo store data
    syncWithDemoStore(FORM_FIELDS, demoStore);
    
    // Clear any additional demo store properties
    if ('basicInfo' in demoStore) {
      demoStore.basicInfo = null;
    }

    // Update initial state for unsaved changes detection
    initialFormStateForUnloadCheck = JSON.stringify(formData.value);
  };

  /**
   * Checks if form has unsaved changes compared to initial state
   * @returns {boolean} True if there are unsaved changes
   */
  const hasUnsavedChanges = () => {
    return JSON.stringify(formData.value) !== initialFormStateForUnloadCheck;
  };

  /**
   * Handles browser beforeunload event to warn about unsaved changes
   * @param {Event} event - Browser beforeunload event
   */
  const handleBeforeUnload = (event) => {
    if (hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  /**
   * Validates a single form field using the schema
   * @param {string} fieldName - Name of the field to validate
   * @returns {Promise<boolean>} True if validation passes, false otherwise
   */
  const validateFormField = async (fieldName) => {
    try {
      // Validate single field using schema
      await basicInfoSchema.pick({ [fieldName]: true }).parseAsync({ 
        [fieldName]: formData.value[fieldName] 
      });
      
      // Clear any existing errors for this field
      clearErrors(fieldName);
      return true;
    } catch (error) {
      // Handle validation errors
      if (error.issues && error.issues.length > 0) {
        fieldErrors.value = { 
          ...fieldErrors.value, 
          [fieldName]: error.issues[0].message 
        };
      }
      return false;
    }
  };

  /**
   * Parses and sets API errors using the field mapping
   * @param {Object} errorResponseData - Error response from API
   * @returns {Object} Parsed errors object
   */
  const parseAndSetApiErrors = (errorResponseData) => {
    return zodParseApiErrors(errorResponseData, API_ERROR_FIELD_MAPPING);
  };

  // Watchers and Lifecycle Hooks

  // Watch form data changes and auto-save to localStorage and demo store
  watch(formData, saveFormState, { deep: true });

  // Component lifecycle - setup
  onMounted(() => {
    componentMounted.value = true;
    loadFormState();
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  // Component lifecycle - cleanup
  onBeforeUnmount(() => {
    componentMounted.value = false;
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  // Public API
  return {
    // Reactive data
    formData,
    fieldErrors,
    formAlertError,
    
    // Validation functions
    validate,
    validateFormField,
    clearErrors,
    
    // Error handling
    parseAndSetApiErrors,
    
    // State management
    clearPersistedFormState,
  };
} 