import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { foreignNationalBankSchema } from '@/features/onboarding/schemas/foreign-national-bank-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore';
import { countryList as COUNTRY_LIST_OBJECTS } from '@/features/onboarding/constants/address-options.js'; // countryList is {name, code}

const LOCAL_STORAGE_KEY = 'foreignBankFormData';

// API field mapping for backend error handling
const API_ERROR_FIELD_MAPPING = {
  bank_name: 'bank_name',
  account_number: 'account_number',
  swift_code: 'swift_code',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  city: 'city',
  country: 'country',
  phone: 'phone',
};

/**
 * Composable for managing foreign national bank form state, validation, and persistence
 */
export function useForeignNationalBankFormManager() {
  const router = useRouter();
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  // Initial form data structure
  const initialFormData = {
    bank_name: '',
    account_number: '',
    swift_code: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    country: '',
    phone: '',
  };

  // Initialize form data
  const formData = ref({ ...initialFormData });

  // Initialize form validation with proper destructuring
  const { 
    errors, 
    serverError, // Note: singular, not plural
    validate, 
    clearErrors, 
    parseApiErrors 
  } = useSimpleFormValidation(foreignNationalBankSchema);

  // Create server errors ref for field-specific backend errors
  const serverErrors = ref({});

  // Computed properties for UI
  const countryList = computed(() => 
    COUNTRY_LIST_OBJECTS.map(c => ({ title: c.name, value: c.code }))
  );

  const isLoading = computed(() => onboardingStore.isLoading);
  const formSubmitError = computed(() => serverError.value || onboardingStore.apiSubmitError);

  // Watch for API field errors from the store and update serverErrors
  watch(() => onboardingStore.apiFieldErrors, (newErrors) => {
    if (newErrors && typeof newErrors === 'object') {
      serverErrors.value = { ...newErrors };
    } else {
      serverErrors.value = {};
    }
  }, { immediate: true });

  // Load form state on mount
  onMounted(() => {
    loadFormState();
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  // Cleanup on unmount
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  // Auto-save form data to localStorage
  watch(formData, (newData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  }, { deep: true });

  /**
   * Loads form state from localStorage or demo store
   */
  const loadFormState = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedData) {
      try {
        formData.value = { ...initialFormData, ...JSON.parse(savedData) };
      } catch (error) {
        console.warn('Could not parse foreign bank form data from localStorage', error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Sync with demoStore if it has data
    if (demoStore.foreignNationalInfo) {
        const demoData = demoStore.foreignNationalInfo;
        formData.value = {
            ...formData.value,
            bank_name: demoData.bankName || '',
            account_number: demoData.accountNumber || '',
            swift_code: demoData.swiftCode || '',
            address_line_1: demoData.addressLine1 || '',
            address_line_2: demoData.addressLine2 || '',
            city: demoData.city || '',
            country: demoData.country || '',
            phone: demoData.phone || '',
        };
    }
  };

  /**
   * Handles browser beforeunload event
   */
  const handleBeforeUnload = (event) => {
    if (JSON.stringify(formData.value) !== JSON.stringify(initialFormData)) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  /**
   * Handles form submission with proper backend error handling
   */
  const handleSubmit = async () => {
    // Clear all previous errors
    clearErrors();
    serverErrors.value = {};

    // Validate signup ID
    if (!demoStore.signupId) {
      serverError.value = 'Invalid session. Please start the signup process again.';
        return;
    }

    // Validate form data
    const validationResult = await validate(formData.value);
    if (!validationResult.isValid) {
      return;
    }

    try {
      // Submit to store/API
    const result = await onboardingStore.submitForeignNationalBankData(formData.value);

    if (result.success) {
        // Clear persisted data on success
      localStorage.removeItem(LOCAL_STORAGE_KEY);
        // Navigate to next step
      router.push('/employment-information'); 
    } else {
        // Handle backend errors
        if (result.error && result.error.response) {
          // Parse API errors using the shared utility
          parseApiErrors(result.error.response.data, API_ERROR_FIELD_MAPPING);
        } else if (result.fieldMessages) {
          // Handle pre-parsed field errors from store
          serverErrors.value = { ...result.fieldMessages };
        }
        
        if (result.generalMessage) {
          serverError.value = result.generalMessage;
        }
      }
    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      
      // Try to parse API errors from caught error
      if (error.response && error.response.data) {
        parseApiErrors(error.response.data, API_ERROR_FIELD_MAPPING);
      } else {
        serverError.value = 'A system error occurred. Please try again later.';
      }
    }
  };
  
  /**
   * Navigates to previous page
   */
  const navigateToPrevious = () => {
    router.go(-1);
  };

  // Public API
  return {
    // Form data
    formData,
    
    // Error handling
    errors,
    serverErrors,
    formSubmitError,
    
    // UI state
    isLoading,
    countryList,
    
    // Actions
    handleSubmit,
    navigateToPrevious,
    validate,
    clearErrors,
  };
} 