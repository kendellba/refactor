import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { childIdSchema } from '@/features/onboarding/schemas/child-id-schema.js';
import { 
    ID_TYPES, 
    DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE 
} from '@/features/onboarding/constants/id-options.js';
import { useDemoStore } from '@/store/demoStore';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';

const LOCAL_STORAGE_KEY = 'childIdFormData';

const getDefaultFormData = () => ({
  firstIdType: '',
  firstIdNumber: '',
  firstExpiryDate: '',
  firstIdDocument: [], // Initialize as empty array for v-file-input multiple
  hasSecondId: false,
  secondIdType: '',
  secondIdNumber: '',
  secondExpiryDate: '',
  secondIdDocument: [], // Initialize as empty array
});

export function useChildIdFormManager() {
  const demoStore = useDemoStore();
  const formData = ref(getDefaultFormData());
  const initialFormStateForUnloadCheck = ref(JSON.stringify(formData.value));

  // Tracks names of previously uploaded files from store, not part of formData for Zod/submission
  const previouslyUploadedFileNames = ref({
    first: null,
    second: null,
  });

  // Use the validation composable correctly
  const {
    errors: fieldErrors,
    serverError: formAlertError,
    validate,
    clearErrors,
  } = useSimpleFormValidation(childIdSchema);

  // Create validateFormField function since it's not provided by useSimpleFormValidation
  const validateFormField = async (fieldName) => {
    if (!formData.value || !fieldName) return;
    
    try {
      // Validate the entire form but only show errors for the specific field
      const result = await childIdSchema.safeParseAsync(formData.value);
      
      if (!result.success) {
        // Clear previous error for this field
        const newErrors = { ...fieldErrors.value };
        delete newErrors[fieldName];
        
        // Add any errors that apply to this field
        result.error.issues.forEach(issue => {
          const path = issue.path.join('.');
          if (path === fieldName) {
            newErrors[fieldName] = issue.message;
          }
        });
        
        fieldErrors.value = newErrors;
      } else {
        // Clear the error for this field if validation passes
        const newErrors = { ...fieldErrors.value };
        delete newErrors[fieldName];
        fieldErrors.value = newErrors;
      }
    } catch (error) {
      console.error('ChildID: Error validating field:', fieldName, error);
    }
  };

  const loadFormState = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    let loadedData = getDefaultFormData();
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Ensure file fields are always arrays, even if localStorage had null/undefined
      loadedData = {
        ...loadedData,
        ...parsed,
        firstIdDocument: Array.isArray(parsed.firstIdDocument) ? parsed.firstIdDocument : [],
        secondIdDocument: Array.isArray(parsed.secondIdDocument) ? parsed.secondIdDocument : [],
      };
    } else if (demoStore.childIdInfo) {
      const storeInfo = demoStore.childIdInfo;
      loadedData.firstIdType = storeInfo.firstIdType || '';
      loadedData.firstIdNumber = storeInfo.firstIdNumber || '';
      loadedData.firstExpiryDate = storeInfo.firstExpiryDate || '';
      // File objects are not in store, but their names might be
      previouslyUploadedFileNames.value.first = storeInfo.firstIdDocumentName || null;
      
      loadedData.hasSecondId = storeInfo.hasSecondId || false;
      if (loadedData.hasSecondId) {
        loadedData.secondIdType = storeInfo.secondIdType || '';
        loadedData.secondIdNumber = storeInfo.secondIdNumber || '';
        loadedData.secondExpiryDate = storeInfo.secondExpiryDate || '';
        previouslyUploadedFileNames.value.second = storeInfo.secondIdDocumentName || null;
      }
    }
    formData.value = loadedData;
    initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
  };

  const clearPersistedFormState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    formData.value = getDefaultFormData();
    initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    previouslyUploadedFileNames.value = { first: null, second: null };
    clearErrors();
  };

  const hasUnsavedChanges = computed(() => {
    // Compare current formData to the state when it was last loaded/saved.
    // File objects in formData.value make direct stringify comparison tricky if they are not serializable or change reference.
    // For simplicity, we'll still use stringify, assuming file inputs are handled such that this mostly works.
    // A more robust check might involve comparing individual fields and file metadata (name, size).
    return JSON.stringify(formData.value) !== initialFormStateForUnloadCheck.value;
  });

  const beforeUnloadHandler = (event) => {
    if (hasUnsavedChanges.value) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  };

  onMounted(() => {
    loadFormState();
    window.addEventListener('beforeunload', beforeUnloadHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    // Save current form data to localStorage if there are changes. This is for navigating away within the app.
    if (hasUnsavedChanges.value) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData.value));
    }
    // Note: demoStore is updated by the Pinia action upon successful submission, not directly here.
  });

  // Watch for changes in formData (excluding file objects themselves for localStorage, as they aren't serializable well)
  watch(() => ({ ...formData.value, firstIdDocument: [], secondIdDocument: [] }), 
    (newData) => {
        // Create a storable version of formData (without actual File objects for localStorage)
        const storableFormData = { ...formData.value };
        // For actual file objects, store their names or a placeholder for localStorage if needed,
        // but the Zod schema expects File objects in formData.value.firstIdDocument etc.
        // So, localStorage will primarily save non-File data. reload will re-init file fields as empty arrays.
        delete storableFormData.firstIdDocument; 
        delete storableFormData.secondIdDocument;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storableFormData));
        // initialFormStateForUnloadCheck is set on load/clear, not every keystroke to reflect "saved state"
    },
    { deep: true }
  );

  // Watch for ID type changes to set default expiry for Birth Certificate
  watch(() => formData.value.firstIdType, (newType) => {
    if (newType === 'Birth Certificate') {
      formData.value.firstExpiryDate = DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE;
    }
  });

  watch(() => formData.value.secondIdType, (newType) => {
    if (formData.value.hasSecondId && newType === 'Birth Certificate') {
      formData.value.secondExpiryDate = DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE;
    }
  });
  
  // Reset second ID fields if hasSecondId is unchecked
  watch(() => formData.value.hasSecondId, (isTrue) => {
    if (!isTrue) {
        formData.value.secondIdType = '';
        formData.value.secondIdNumber = '';
        formData.value.secondExpiryDate = '';
        formData.value.secondIdDocument = [];
        if(fieldErrors.value.secondIdType) delete fieldErrors.value.secondIdType;
        if(fieldErrors.value.secondIdNumber) delete fieldErrors.value.secondIdNumber;
        if(fieldErrors.value.secondExpiryDate) delete fieldErrors.value.secondExpiryDate;
        if(fieldErrors.value.secondIdDocument) delete fieldErrors.value.secondIdDocument;
    }
  });


  return {
    formData,
    fieldErrors,
    formAlertError,
    previouslyUploadedFileNames,
    validate,
    validateFormField,
    clearErrors,
    clearPersistedFormState,
    hasUnsavedChanges, // Expose for potential use in component if needed beyond beforeunload
  };
} 