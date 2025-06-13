import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { loginSchema } from '@/features/auth/schemas/login-schema.js';
import { useAuthFeatureStore } from '@/features/auth/stores/authFeatureStore.js';

export function useLoginFormManager() {
  const router = useRouter(); // For navigation like forgotPassword, navigateToSignup
  const authFeatureStore = useAuthFeatureStore();

  const formData = ref({
    email: '',
    password: '',
  });

  const showPassword = ref(false);

  const { errors, validate, clearErrors, serverErrors } = useSimpleFormValidation(loginSchema);
  // Note: serverErrors from useSimpleFormValidation might not be directly used if 
  // authFeatureStore.error provides a general message displayed in an alert.
  // If API returns field-specific errors for login, this could be wired up.

  const isLoading = computed(() => authFeatureStore.isLoading);
  const errorMessage = computed(() => authFeatureStore.error); // General error from the store

  const handleLoginSubmit = async () => {
    clearErrors(); // Clear previous Zod errors
    authFeatureStore.error = null; // Clear previous API error from store

    const isValid = await validate(formData.value);
    if (!isValid) {
      return;
    }

    // Call the login action from the auth feature store
    const result = await authFeatureStore.login(formData.value.email, formData.value.password);
    
    // Navigation is handled within the store action upon success.
    // If login fails, authFeatureStore.error will be set and displayed by the component.
  };

  const forgotPassword = () => {
    router.push('/forgot-password');
  };

  const navigateToSignup = () => {
    // The original component navigates to /new-or-existing-customer
    router.push('/new-or-existing-customer'); 
  };

  return {
    formData,
    showPassword,
    errors, // Zod validation errors
    isLoading,
    errorMessage, // API errors from store
    handleLoginSubmit,
    forgotPassword,
    navigateToSignup,
    // Expose validate and clearErrors if needed for more granular control in component (e.g., on blur)
    validateField: async (field) => {
        const tempFormData = { ...formData.value };
        // Create a partial schema for the field or validate the specific field against the full schema
        // This is a simplified approach; more complex partial validation might be needed.
        await validate(tempFormData); // Re-validate all, Zod errors for the field will update
        return errors.value[field]; // Return specific field error after validation
    },
    clearFieldErrors: (field) => {
        if(errors.value[field]){
            delete errors.value[field];
        }
    }
  };
} 