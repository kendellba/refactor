import { ref, onMounted } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { accountNumberSchema } from '@/features/onboarding/schemas/account-number-schema.js';
import { useDemoStore } from '@/store/demoStore';

export function useAccountNumberFormManager() {
  const demoStore = useDemoStore();

  const formData = ref({
    account_number: '',
  });

  const {
    errors: fieldErrors,
    serverError,
    validate,
    clearErrors,
  } = useSimpleFormValidation(accountNumberSchema);

  // Custom validation function for individual fields
  const validateField = async (fieldName) => {
    try {
      const result = await accountNumberSchema.safeParseAsync(formData.value);
      if (!result.success) {
        const fieldError = result.error.errors.find(err => err.path[0] === fieldName);
        if (fieldError) {
          fieldErrors.value = {
            ...fieldErrors.value,
            [fieldName]: [fieldError.message]
          };
        }
      } else {
        // Clear error for this field if validation passes
        if (fieldErrors.value[fieldName]) {
          const newErrors = { ...fieldErrors.value };
          delete newErrors[fieldName];
          fieldErrors.value = newErrors;
        }
      }
    } catch (error) {
      console.error('Field validation error:', error);
    }
  };

  onMounted(() => {
    // Load from demo store if available
    if (demoStore.accountNumber) {
      formData.value.account_number = demoStore.accountNumber;
    }
  });

  return {
    formData,
    fieldErrors,
    serverError,
    validate: (data) => validate(data || formData.value),
    validateField,
    clearErrors,
  };
} 