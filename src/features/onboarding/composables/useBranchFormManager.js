import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { branchSchema } from '@/features/onboarding/schemas/branch-schema.js';
import { useDemoStore } from '@/store/demoStore';

const LOCAL_STORAGE_KEY = 'branchFormData';

const getDefaultFormData = () => ({
  selectedBranch: '',
  preferredContactMethod: '',
  bestContactTime: '',
});

export function useBranchFormManager() {
  const demoStore = useDemoStore();
  
  // Initialize formData with default values
  const formData = ref(getDefaultFormData());
  const initialFormStateForUnloadCheck = ref(JSON.stringify(getDefaultFormData()));

  const {
    errors: fieldErrors,
    serverError: formAlertError,
    validate,
    validateFormField,
    clearErrors,
  } = useSimpleFormValidation(branchSchema);

  const saveFormState = () => {
    if (formData.value) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData.value));
      initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    }
  };

  const loadFormState = () => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        formData.value = { ...getDefaultFormData(), ...parsedState };
      } else if (demoStore.branchInfo) {
        formData.value = {
          selectedBranch: demoStore.branchInfo.branchName || '',
          preferredContactMethod: demoStore.branchInfo.preferredContactMethod || '',
          bestContactTime: demoStore.branchInfo.bestContactTime || '',
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

  const clearPersistedFormState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    formData.value = getDefaultFormData();
    initialFormStateForUnloadCheck.value = JSON.stringify(formData.value);
    clearErrors();
  };

  const hasUnsavedChanges = computed(() => {
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
  });

  // Watch for changes in formData to save to localStorage automatically
  watch(formData, (newData) => {
    if (newData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    }
  }, { deep: true });

  // Watch for demoStore changes
  watch(() => demoStore.branchInfo, (newInfo) => {
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