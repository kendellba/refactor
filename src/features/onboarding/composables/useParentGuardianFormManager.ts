import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { parentGuardianSchema } from '@/features/onboarding/schemas/parent-guardian-schema.js';
import { useDemoStore } from '@/store/demoStore';

const LOCAL_STORAGE_KEY = 'parentGuardianFormData';

export function useParentGuardianFormManager() {
  const demoStore = useDemoStore();

  const formData = ref({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    mobile: '',
    relationship_to_child: '',
    guardian_files: [],
  });

  const {
    errors: fieldErrors,
    serverError,
    validate,
    clearErrors,
  } = useSimpleFormValidation(parentGuardianSchema);

  const validateField = async (fieldName) => {
    if (!formData.value || !fieldName) return;
    
    try {
      const result = await parentGuardianSchema.safeParseAsync(formData.value);
      
      if (!result.success) {
        const newErrors = { ...fieldErrors.value };
        delete newErrors[fieldName];
        
        result.error.issues.forEach(issue => {
          const path = issue.path.join('.');
          if (path === fieldName) {
            newErrors[fieldName] = issue.message;
          }
        });
        
        fieldErrors.value = newErrors;
      } else {
        const newErrors = { ...fieldErrors.value };
        delete newErrors[fieldName];
        fieldErrors.value = newErrors;
      }
    } catch (error) {
      console.error('ParentGuardian: Error validating field:', fieldName, error);
    }
  };

  let isUnloading = false;

  const handleBeforeUnload = (event) => {
    if (hasUnsavedChanges()) {
      isUnloading = true;
      event.preventDefault();
      event.returnValue = '';
    }
  };

  const hasUnsavedChanges = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return JSON.stringify(formData.value) !== savedData;
  };

  const loadPersistedData = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      formData.value = JSON.parse(savedData);
    } else if (demoStore.guardianInfo) {
      formData.value = {
        first_name: demoStore.guardianInfo.firstName || '',
        last_name: demoStore.guardianInfo.lastName || '',
        middle_name: demoStore.guardianInfo.middleName || '',
        email: demoStore.guardianInfo.email || '',
        mobile: demoStore.guardianInfo.mobile || '',
        relationship_to_child: demoStore.guardianInfo.relationshipToChild || '',
        guardian_files: [],
      };
    }
  };

  const clearPersistedFormData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };
  
  const clearBeforeUnloadWarning = () => {
    isUnloading = false;
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  onMounted(() => {
    loadPersistedData();
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    if (!isUnloading) {
      demoStore.$patch({
        guardianInfo: {
          firstName: formData.value.first_name,
          lastName: formData.value.last_name,
          middleName: formData.value.middle_name,
          email: formData.value.email,
          mobile: formData.value.mobile,
          relationshipToChild: formData.value.relationship_to_child,
        }
      });
    }
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  watch(formData, (newData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  }, { deep: true });

  return {
    formData,
    fieldErrors,
    serverError,
    validate,
    validateField,
    clearErrors,
    loadPersistedData,
    clearPersistedFormData,
    clearBeforeUnloadWarning,
  };
} 