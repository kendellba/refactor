import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { poaSchema } from '@/features/onboarding/schemas/poa-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore.js';

const LOCAL_STORAGE_KEY = 'poaFormData';

const initialFormData = {
  first_name: '',
  last_name: '',
  middle_name: '',
  dob: '',
  gender: null, // Use null for unselected state in selects/radios
  email: '',
  phone: '',
  relationship_to_principal: null,
  address_line_1: '',
  address_line_2: '',
  city: '',
  country: null,
  id_type: null,
  id_number: '',
  id_document: null, // Will hold File object(s)
  power_of_attorney_document: null, // Will hold File object(s)
};

export function usePoaFormManager() {
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  // Create form data ref
  const formData = ref({ ...initialFormData });
  
  const {
    errors,
    serverError,
    validate,
    parseApiErrors,
    clearErrors,
  } = useSimpleFormValidation(poaSchema);

  let isDirty = ref(false);

  // Form data management functions
  const setFormData = (data) => {
    formData.value = { ...initialFormData, ...data };
  };

  const updateField = (fieldName, value) => {
    formData.value[fieldName] = value;
  };

  const loadPersistedData = () => {
    let loadedData = null;
    if (demoStore.powerOfAttorneyInfo && Object.keys(demoStore.powerOfAttorneyInfo).length > 0) {
      loadedData = { ...demoStore.powerOfAttorneyInfo };
      // Ensure file fields are null if not present or if they were stored as names
      loadedData.id_document = null;
      loadedData.power_of_attorney_document = null;
    } else {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          loadedData = JSON.parse(savedData);
          // Ensure file fields are reset as they can't be stringified/parsed from localStorage
          loadedData.id_document = null;
          loadedData.power_of_attorney_document = null;
        } catch (e) {
          console.error(`Error parsing POA form data from localStorage: ${LOCAL_STORAGE_KEY}`, e);
        }
      }
    }
    setFormData(loadedData || { ...initialFormData });
    isDirty.value = false; // Reset dirty flag after loading
  };

  const saveToLocalStorage = (data) => {
    try {
      // Create a copy to avoid modifying the reactive formData directly for storage
      const dataToStore = { ...data };
      delete dataToStore.id_document; // Don't store File objects
      delete dataToStore.power_of_attorney_document;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Could not save POA form data to localStorage:', error);
    }
  };

  const beforeUnloadHandler = (event) => {
    if (isDirty.value) {
      event.preventDefault();
      event.returnValue = ''; // Standard for most browsers
    }
  };

  const setupBeforeUnloadWarning = () => {
    window.addEventListener('beforeunload', beforeUnloadHandler);
  };

  const clearBeforeUnloadWarning = () => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    isDirty.value = false; // Reset dirty flag when warning is cleared (e.g. on submit)
  };

  // Watch for formData changes to set isDirty and save to localStorage
  watch(formData, (newData, oldData) => {
    if (oldData && Object.keys(oldData).length > 0) { // Ensure it's not the initial set
      isDirty.value = true;
    }
    saveToLocalStorage(newData);
  }, { deep: true });

  // Clear store API errors when form data changes by user
  watch(formData, () => {
    if (onboardingStore.apiSubmitError) {
      onboardingStore.apiSubmitError = null;
    }
    // Optionally clear specific field errors from store: onboardingStore.apiFieldErrors = {};
  }, { deep: true });

  onMounted(() => {
    loadPersistedData();
    setupBeforeUnloadWarning();
  });

  onBeforeUnmount(() => {
    clearBeforeUnloadWarning();
    // Decide if we should clear localStorage here or not. Generally, no, to allow resume.
  });

  // Function to explicitly clear localStorage for this form if needed (e.g., after successful submission)
  const clearPersistedFormData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    isDirty.value = false;
  };

  // Handler functions
  const handlePoaFormSubmit = async () => {
    const validationResult = await validate(formData.value);
    if (validationResult.isValid) {
      try {
        // Submit form data to API
        await onboardingStore.submitPowerOfAttorneyAction(formData.value);
        clearPersistedFormData();
        clearBeforeUnloadWarning();
        // Navigate to next step or show success message
      } catch (error) {
        console.error('POA form submission error:', error);
        if (error.response?.data) {
          parseApiErrors(error.response.data);
        }
      }
    }
  };

  const handleAddPoa = () => {
    // Add POA logic if needed
    console.log('Add POA functionality not implemented yet');
  };

  const handleRemovePoa = () => {
    // Remove POA logic if needed
    console.log('Remove POA functionality not implemented yet');
  };

  const handleConfirmRemovePoa = () => {
    // Confirm remove POA logic if needed
    console.log('Confirm remove POA functionality not implemented yet');
  };

  const handleCancelRemovePoa = () => {
    // Cancel remove POA logic if needed
    console.log('Cancel remove POA functionality not implemented yet');
  };

  return {
    formData,
    validate,
    clearErrors,
    errors,
    serverError,
    parseApiErrors,
    updateField,
    setFormData,
    loadPersistedData, // Expose if manual reload is needed
    clearPersistedFormData,
    clearBeforeUnloadWarning, // Expose to call on successful submit
    isDirty, // Expose to allow component to know if form has changes
    handlePoaFormSubmit,
    handleAddPoa,
    handleRemovePoa,
    handleConfirmRemovePoa,
    handleCancelRemovePoa,
  };
} 