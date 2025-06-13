import { ref, watch, onMounted } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { pepSchema } from '@/features/onboarding/schemas/pep-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore';

const initialFormData = {
  isPEP: null, // Using null to represent an unselected state for the radio/boolean
  domestic_foreign_roles: [],
  immediate_family_members: [],
  international_roles: [],
  jobTitle: '',
  is_close_associate: 'no', // Default to 'no' as per original component
  relationship_type: '',
  associate_name: '',
};

export function usePepFormManager() {
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  // Create formData ref manually since useSimpleFormValidation doesn't provide it
  const formData = ref({ ...initialFormData });

  // Use the validation composable correctly
  const { 
    errors: fieldErrors,
    serverError, // General Zod validation error message
    validate,
    clearErrors,
    parseApiErrors,
  } = useSimpleFormValidation(pepSchema);

  // Helper function to update form data
  const updateField = (fieldName, value) => {
    formData.value[fieldName] = value;
  };

  // Helper function to set entire form data
  const setFormData = (newData) => {
    formData.value = { ...formData.value, ...newData };
  };

  // Helper function to validate individual fields
  const validateField = async (fieldName) => {
    if (!formData.value || !fieldName) return;
    
    try {
      // For complex schemas with refinements, validate the entire form
      // but only show errors for the specific field
      const result = await pepSchema.safeParseAsync(formData.value);
      
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
      console.error('PEP: Error validating field:', fieldName, error);
    }
  };

  const loadPersistedData = () => {
    // Attempt to load from demoStore.pepInfo first
    if (demoStore.pepInfo) {
      const { 
        isPEP, 
        domestic_foreign_roles, 
        immediate_family_members, 
        international_roles, 
        jobTitle, 
        is_close_associate, 
        relationship_type, 
        associate_name 
      } = demoStore.pepInfo;
      
      // Ensure arrays are initialized correctly if not present in store
      setFormData({
        isPEP: isPEP ?? null,
        domestic_foreign_roles: domestic_foreign_roles || [],
        immediate_family_members: immediate_family_members || [],
        international_roles: international_roles || [],
        jobTitle: jobTitle || '',
        is_close_associate: is_close_associate || 'no',
        relationship_type: relationship_type || '',
        associate_name: associate_name || '',
      });
    } else {
      // Default to initial if not in demoStore
      setFormData({ ...initialFormData });
    }
  };

  // Clear errors from store when form data changes, to avoid stale API errors showing
  watch(formData, () => {
    if (onboardingStore.apiSubmitError) {
      onboardingStore.apiSubmitError = null;
    }
  }, { deep: true });

  return {
    formData,
    validate,
    validateField, // Expose field validation
    clearErrors,
    fieldErrors,
    serverError,
    updateField,
    loadPersistedData, // Expose loader
    setFormData, // Expose setter for flexibility
    parseApiErrors, // Expose for API error handling
  };
} 