import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { mailingAddressSchema } from '@/features/onboarding/schemas/mailing-address-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore';

const LOCAL_STORAGE_KEY = 'mailingAddressFormData';

export function useMailingAddressFormManager() {
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  const initialFormData = {
    sameAsResidential: false,
    address_line_1: '',
    address_line_2: '',
    city: '',
    country: '',
    proof_of_address_files: [], // Initialize as empty array for v-file-input multiple
  };

  const formData = ref({ ...initialFormData });

  const {
    errors: zodFieldErrors,      // Zod validation errors
    serverError: formAlertError, // General error from useSimpleFormValidation, can be set manually
    validate,                
    clearErrors: clearZodErrors, 
  } = useSimpleFormValidation(mailingAddressSchema);

  const componentMounted = ref(true);
  let initialFormStateForUnloadCheck = JSON.stringify(formData.value);

  const isLoading = computed(() => onboardingStore.isLoading);
  // Use a ref for general form error that can be updated by store response
  const submissionError = ref(null); 
  // Use a ref for field errors that can be updated by store response
  const apiFieldErrors = ref({});

  const loadFormState = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        formData.value = {
          ...initialFormData, 
          ...parsedData,
          proof_of_address_files: parsedData.proof_of_address_files || [],
        };
      } catch (e) {
        console.error('Error parsing mailingAddressFormData from localStorage:', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    initialFormStateForUnloadCheck = JSON.stringify(formData.value);
  };

  const saveFormState = () => {
    if (componentMounted.value) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData.value));
    }
  };

  const clearPersistedFormState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    formData.value = { ...initialFormData };
    initialFormStateForUnloadCheck = JSON.stringify(formData.value);
    clearZodErrors(''); // Clear Zod errors with required parameter
    submissionError.value = null; // Clear API submission errors
    apiFieldErrors.value = {};
  };

  watch(formData, saveFormState, { deep: true });

  // Logic for 'Same as Residential Address' checkbox
  watch(() => formData.value.sameAsResidential, (isSame) => {
    clearZodErrors(''); // Clear validation errors when checkbox state changes
    submissionError.value = null;
    apiFieldErrors.value = {};
    
    if (isSame) {
      const residential = demoStore.addressInfo;
      formData.value.address_line_1 = residential?.addressLine1 || '';
      formData.value.address_line_2 = residential?.addressLine2 || '';
      formData.value.city = residential?.city || '';
      formData.value.country = residential?.country || '';
      formData.value.proof_of_address_files = []; // Clear files
    } else {
      // If unchecking, clear the fields that were copied
      // Only clear if they were potentially from residential, or reset to initial (empty)
      // Check against demoStore data to avoid clearing user input if they uncheck then re-check without changes
      formData.value.address_line_1 = ''; // Or some logic to revert to pre-check state if needed
      formData.value.address_line_2 = '';
      formData.value.city = '';
      formData.value.country = '';
      formData.value.proof_of_address_files = [];
    }
    // Trigger validation for relevant fields if needed, or let submit handle it.
  }, { immediate: false }); // immediate: false to avoid running on initial load if sameAsResidential is persisted true

  const handleBeforeUnload = (event) => {
    if (JSON.stringify(formData.value) !== initialFormStateForUnloadCheck) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  onMounted(() => {
    componentMounted.value = true;
    loadFormState();
    window.addEventListener('beforeunload', handleBeforeUnload);
    // If loaded state has sameAsResidential = true, ensure fields are populated.
    if (formData.value.sameAsResidential) {
        const residential = demoStore.addressInfo;
        formData.value.address_line_1 = residential?.addressLine1 || formData.value.address_line_1;
        formData.value.address_line_2 = residential?.addressLine2 || formData.value.address_line_2;
        formData.value.city = residential?.city || formData.value.city;
        formData.value.country = residential?.country || formData.value.country;
        // proof_of_address_files should already be handled by loadFormState or be empty
    }
  });

  onBeforeUnmount(() => {
    componentMounted.value = false;
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  const handleSubmit = async () => {
    clearZodErrors('');
    submissionError.value = null;
    apiFieldErrors.value = {};

    const { isValid } = await validate(formData.value);
    if (!isValid) {
      // zodFieldErrors are automatically updated by validate()
      return;
    }

    const result = await onboardingStore.submitMailingAddressData(formData.value);

    if (result.success) {
      clearPersistedFormState();
      // Navigation is handled within the store action
    } else {
      submissionError.value = result.generalMessage || 'Submission failed.';
      if (result.fieldMessages) {
        apiFieldErrors.value = result.fieldMessages;
      }
      // If useSimpleFormValidation's serverError is preferred for general message:
      // formAlertError.value = result.generalMessage || 'Submission failed';
    }
  };
  
  const handleFileChange = (files) => {
    // v-file-input with `multiple` provides an array of files.
    // The schema expects an array. If not multiple, it's a single file.
    formData.value.proof_of_address_files = files; // directly assign the array
    // Optionally, trigger validation for the file field
    // validateFormField('proof_of_address_files'); 
  };

  // Create a simple ref for field errors instead of computed to avoid slot warnings
  const fieldErrors = ref({});
  
  // Watch for changes in both error sources and update fieldErrors
  watch([zodFieldErrors, apiFieldErrors], () => {
    fieldErrors.value = { ...zodFieldErrors.value, ...apiFieldErrors.value };
  }, { immediate: true, deep: true });

  return {
    formData,
    isLoading,
    submissionError, // For general API errors
    fieldErrors, // Combined Zod and API field errors as ref instead of computed
    validate,          
    clearErrors: () => {
        clearZodErrors();
        submissionError.value = null;
        apiFieldErrors.value = {};
        fieldErrors.value = {};
    },
    handleSubmit,
    handleFileChange,
    clearPersistedFormState,
  };
} 