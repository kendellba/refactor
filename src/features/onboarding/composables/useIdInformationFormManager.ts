import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { idInformationSchema } from '@/features/onboarding/schemas/id-information-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore';
import { 
    ID_TYPES, 
    DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE 
} from '@/features/onboarding/constants/id-options.js';
import { calculateAge as calculateAgeUtility } from '@/utils/userValidation'; // Assuming this path is correct

const LOCAL_STORAGE_KEY = 'idInformationFormData';

export function useIdInformationFormManager() {
  const router = useRouter();
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  const initialFormData = {
    firstIdType: '',
    firstIdNumber: '',
    firstExpiryDate: '',
    firstIdDocument: [], // Store as array for v-file-input, schema expects array with 1 file
    secondIdType: '',
    secondIdNumber: '',
    secondExpiryDate: '',
    secondIdDocument: [], // Store as array
  };

  const formData = ref({ ...initialFormData });
  const formKeyFirst = ref(Date.now()); // For v-file-input re-rendering
  const formKeySecond = ref(Date.now() + 1); // For v-file-input re-rendering

  const {
    errors,
    serverError,
    validate,
    clearErrors,
  } = useSimpleFormValidation(idInformationSchema);

  const serverErrors = ref({});

  const isLoading = computed(() => onboardingStore.isLoading);
  const formSubmitError = computed(() => onboardingStore.apiSubmitError);

  // Expose serverErrors (populated by onboardingStore.apiFieldErrors)
  watch(() => onboardingStore.apiFieldErrors, (newErrors) => {
    serverErrors.value = newErrors || {};
  });

  const minDate = computed(() => new Date().toISOString().split('T')[0]);
  const maxExpiryDate = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 20); // Max 20 years in future for expiry
    return date.toISOString().split('T')[0];
  });

  const idTypeOptions = computed(() => {
    console.log('ID_TYPES:', ID_TYPES);
    return ID_TYPES;
  }); // Already in {title, value} format
  
  const secondIdTypeOptions = computed(() => {
    const filtered = ID_TYPES.filter(type => type.value !== formData.value.firstIdType);
    console.log('secondIdTypeOptions:', filtered, 'firstIdType:', formData.value.firstIdType);
    return filtered;
  });

  // Auto-set expiry for birth certificates
  watch(() => formData.value.firstIdType, (newType) => {
    if (newType === 'Birth Certificate') {
      formData.value.firstExpiryDate = DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE;
    }
  });
  watch(() => formData.value.secondIdType, (newType) => {
    if (newType === 'Birth Certificate') {
      formData.value.secondExpiryDate = DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE;
    }
  });

  onMounted(() => {
    if (!(demoStore as any).signupId) {
      // Redirect if essential preceding data is missing
      router.push('/basic-info'); // Or a more appropriate starting page
      return;
    }

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure files are not loaded directly
        parsedData.firstIdDocument = []; 
        parsedData.secondIdDocument = [];
        formData.value = { ...initialFormData, ...parsedData };
      } catch (e) {
        console.warn('Could not parse ID Information form data from localStorage', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Sync with demoStore if it has data (e.g., user navigating back)
    if ((demoStore as any).idInformation) {
        const demoData = (demoStore as any).idInformation;
        formData.value = {
            ...formData.value, // Keep any localStorage data not in demoStore
            firstIdType: demoData.firstIdType || '',
            firstIdNumber: demoData.firstIdNumber || '',
            firstExpiryDate: demoData.firstExpiryDate || '',
            // Documents are not restored from demoStore filenames for now, user needs to re-select
            secondIdType: demoData.secondIdType || '',
            secondIdNumber: demoData.secondIdNumber || '',
            secondExpiryDate: demoData.secondExpiryDate || '',
        };
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  watch(formData, (newData) => {
    const dataToSave = { ...newData };
    delete dataToSave.firstIdDocument; // Don't save File objects
    delete dataToSave.secondIdDocument;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, { deep: true });

  const handleBeforeUnload = (event) => {
    const { firstIdDocument, secondIdDocument, ...comparableData } = formData.value;
    const { firstIdDocument: initialFirstDoc, secondIdDocument: initialSecondDoc, ...initialComparableData } = initialFormData;
    if (JSON.stringify(comparableData) !== JSON.stringify(initialComparableData) || firstIdDocument.length > 0 || secondIdDocument.length > 0) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  const handleFileUpload = (files, idSetKey) => {
    
    formData.value[idSetKey] = files ? (Array.isArray(files) ? files : [files]) : [];
  };

  const clearFileSelection = (idSetKey, formKeyRef) => {
    formData.value[idSetKey] = [];
    formKeyRef.value = Date.now(); // Force re-render of v-file-input
  };

  const handleSubmit = async () => {
    clearErrors("");
    if (!(demoStore as any).signupId) {
      onboardingStore.apiSubmitError = 'Invalid session. Please start the signup process again.';
      return;
    }

    const isValid = await validate(formData.value);
    if (!isValid) return;

    const result = await onboardingStore.submitIdInformationData(formData.value);

    if (result.success) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      // Navigate based on customer type (as per original component logic)
      // Assuming customerType is available in demoStore, populated after NewOrExistingCustomer step
      if ((demoStore as any).customerType === 'existing') {
        router.push('/account-number');
      } else {
        router.push('/due-diligence');
      }
    } else {
      // Errors are set in the store and watched by computed properties
    }
  };
  
  const navigateToPrevious = () => {
    router.go(-1); 
  };

  const getPlaceholderForIdType = (idType) => {
    switch (idType) {
      case 'National ID': return 'Enter 6-11 digit ID number';
      case "Driver's License": return 'Enter 10 alphanumeric characters';
      case 'Passport': return 'Enter 8 alphanumeric characters';
      case 'Birth Certificate': return 'Enter up to 12 alphanumeric characters';
      default: return 'Enter ID number';
    }
  };

  return {
    formData,
    errors,
    serverErrors,
    formSubmitError,
    isLoading,
    handleSubmit,
    navigateToPrevious,
    handleFileUpload,
    clearFileSelection,
    formKeyFirst,
    formKeySecond,
    idTypeOptions,
    secondIdTypeOptions,
    minDate,
    maxExpiryDate,
    getPlaceholderForIdType,
    DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE, // For direct use in template if needed for disabled state logic
  };
} 
