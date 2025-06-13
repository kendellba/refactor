import { ref, watch, onMounted, onBeforeUnmount, computed, type Ref } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { branchSchema } from '@/features/onboarding/schemas/branch-schema.js';
import { useDemoStore } from '@/store/demoStore';

// Type definitions
interface BranchFormData {
  selectedBranch: string;
  preferredContactMethod: string;
  bestContactTime: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ValidationResult {
  isValid: boolean;
  errors?: FormErrors;
}

const LOCAL_STORAGE_KEY = 'branchFormData';

const getDefaultFormData = (): BranchFormData => ({
  selectedBranch: '',
  preferredContactMethod: '',
  bestContactTime: '',
});

export function useBranchFormManager() {
  const demoStore = useDemoStore();
  
  // Initialize formData with explicit typing
  const formData: Ref<BranchFormData> = ref(getDefaultFormData());
  const initialFormStateForUnloadCheck = ref(JSON.stringify(getDefaultFormData()));

  const {
    errors: fieldErrors,
    serverError: formAlertError,
    validate,
    validateFormField: baseValidateFormField,
    clearErrors,
  } = useSimpleFormValidation(branchSchema);

  // Create a typed validateFormField wrapper
  const validateFormField = async (field: string, data: BranchFormData): Promise<void> => {
    return baseValidateFormField(field, data);
  };

  const saveFormState = (): void => {
    if (formData.value) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData.value));
      initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    }
  };

  const loadFormState = (): void => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        formData.value = { ...getDefaultFormData(), ...parsedState };
      } else if ((demoStore as any).branchInfo) {
        formData.value = {
          selectedBranch: (demoStore as any).branchInfo.branchName || '',
          preferredContactMethod: (demoStore as any).branchInfo.preferredContactMethod || '',
          bestContactTime: (demoStore as any).branchInfo.bestContactTime || '',
        };
      } else {
        formData.value = getDefaultFormData();
      }
      initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    } catch (e) {
      console.error('Error loading branch form state:', e);
      formData.value = getDefaultFormData();
      initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    }
  };

  const clearPersistedFormState = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    formData.value = getDefaultFormData();
    initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    clearErrors();
  };

  const hasUnsavedChanges = computed(() => {
    return JSON.stringify(formData.value) !== initialFormStateForUnloadCheck.value;
  });

  const beforeUnloadHandler = (event: BeforeUnloadEvent): void => {
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
  });

  // Watch for changes in formData to save to localStorage automatically
  watch(formData, (newData: BranchFormData) => {
    if (newData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    }
  }, { deep: true });

  // Watch for demoStore changes
  watch(() => (demoStore as any).branchInfo, (newInfo) => {
    if (newInfo && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
      formData.value = {
        selectedBranch: newInfo.branchName || '',
        preferredContactMethod: newInfo.preferredContactMethod || '',
        bestContactTime: newInfo.bestContactTime || '',
      };
      initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    }
  }, { deep: true, immediate: false });

  return {
    formData,
    fieldErrors,
    formAlertError,
    validate,
    validateFormField,
    clearErrors,
    saveFormState,
    loadFormState,
    clearPersistedFormState,
    hasUnsavedChanges,
  };
} 
