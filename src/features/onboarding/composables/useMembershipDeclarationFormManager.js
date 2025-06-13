import { ref, watch } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { membershipDeclarationSchema } from '@/features/onboarding/schemas/membership-declaration-schema.js';
// import { useDemoStore } from '@/store/demoStore'; // If needed for loading initial data, though likely not for this form

export function useMembershipDeclarationFormManager() {
  // const demoStore = useDemoStore(); // Instantiate if loading initial state from demoStore

  const formData = ref({
    isMemberOfAnotherCreditUnion: 'no', // Default value
    creditUnionName: '',
    isServingOnBoard: 'no', // Default value
    creditUnionBoardName: '',
  });

  const {
    errors: fieldErrors,
    serverError, // This will be populated by the component from store's apiSubmitError
    validate,
    clearErrors,
    // validateField, // if available and needed
  } = useSimpleFormValidation(membershipDeclarationSchema, formData);

  // Watchers to clear conditional fields if the condition changes
  watch(() => formData.value.isMemberOfAnotherCreditUnion, (newValue) => {
    if (newValue === 'no') {
      formData.value.creditUnionName = '';
      if (fieldErrors.value.creditUnionName) {
        delete fieldErrors.value.creditUnionName;
      }
    }
  });

  watch(() => formData.value.isServingOnBoard, (newValue) => {
    if (newValue === 'no') {
      formData.value.creditUnionBoardName = '';
      if (fieldErrors.value.creditUnionBoardName) {
        delete fieldErrors.value.creditUnionBoardName;
      }
    }
  });

  // Function to load initial data if necessary (e.g., from Pinia store if user revisits form)
  // const loadPersistedData = () => {
  //   const persistedData = demoStore.membershipInfo; // Example path
  //   if (persistedData) {
  //     formData.value.isMemberOfAnotherCreditUnion = persistedData.isMemberOfAnotherCreditUnion || 'no';
  //     formData.value.creditUnionName = persistedData.creditUnionName || '';
  //     formData.value.isServingOnBoard = persistedData.isServingOnBoard || 'no';
  //     formData.value.creditUnionBoardName = persistedData.creditUnionBoardName || '';
  //   }
  // };

  // onMounted(() => {
  //   loadPersistedData();
  // });

  return {
    formData,
    fieldErrors,
    serverError, // Expose for component to potentially set from store
    validate,
    clearErrors,
    // validateField,
    // loadPersistedData, // Expose if manual load trigger is needed
  };
} 