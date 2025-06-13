import { ref, computed, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useSimpleFormValidation } from '@/shared/composables/useSimpleFormValidation.js';
import { beneficiarySchema } from '@/features/onboarding/schemas/beneficiary-schema.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useDemoStore } from '@/store/demoStore';

const LOCAL_STORAGE_KEY_FORM = 'beneficiaryFormData'; // For the beneficiary being edited/added
const LOCAL_STORAGE_KEY_LIST = 'beneficiariesList'; // For the list of already added beneficiaries

const getDefaultBeneficiaryFormData = () => ({
  first_name: '',
  last_name: '',
  middle_name: '',
  dob: '',
  gender: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  country: '',
  relationship_to_beneficiary: '',
  id_type: '',
  id_number: '',
  percent_of_beneficiary_interest: null, // Or 0, ensure Zod schema handles initial null/0 correctly
});

export function useBeneficiaryFormManager() {
  const onboardingStore = useOnboardingStore();
  const demoStore = useDemoStore();

  const currentBeneficiaryFormData = ref(getDefaultBeneficiaryFormData());
  const addedBeneficiariesList = ref([]); // This will hold beneficiaries successfully added (and potentially API-confirmed)
  
  const {
    errors: currentBeneficiaryFieldErrors, // Errors for the current beneficiary form
    serverError: currentBeneficiaryFormAlert, // Alert for the current beneficiary form
    validate: validateCurrentBeneficiaryForm,     // Validation function for current form
    clearErrors: clearCurrentBeneficiaryFormErrors, // Clears errors for current form
  } = useSimpleFormValidation(beneficiarySchema);

  const formWideAlert = ref(null); // For errors like 'total percentage > 100%'
  const confirmRemoveDialog = ref(false);
  const beneficiaryIndexToRemove = ref(null);

  const componentMounted = ref(true);
  const countdown = ref(0);
  const showCountdown = ref(false);
  const countdownTimer = ref(null);

  // --- Computed Properties ---
  const totalPercentageAdded = computed(() => {
    return Number(
      addedBeneficiariesList.value
        .reduce((sum, b) => sum + Number(b.percent_of_beneficiary_interest || 0), 0)
        .toFixed(2)
    );
  });

  const remainingPercentageAvailable = computed(() => {
    // Considers already added beneficiaries for the 100% limit.
    return Number(Math.max(0, 100 - totalPercentageAdded.value).toFixed(2));
  });

  // --- Persistence --- 
  const loadState = () => {
    const savedForm = localStorage.getItem(LOCAL_STORAGE_KEY_FORM);
    if (savedForm) currentBeneficiaryFormData.value = JSON.parse(savedForm);
    
    const savedList = localStorage.getItem(LOCAL_STORAGE_KEY_LIST);
    if (savedList) {
      addedBeneficiariesList.value = JSON.parse(savedList);
    } else if ((demoStore as any).beneficiaryInfo && (demoStore as any).beneficiaryInfo.length > 0) {
      addedBeneficiariesList.value = JSON.parse(JSON.stringify((demoStore as any).beneficiaryInfo)); // Deep copy
    }
    initialStateForUnloadCheck.form = JSON.stringify(currentBeneficiaryFormData.value);
    initialStateForUnloadCheck.list = JSON.stringify(addedBeneficiariesList.value);
  };

  const persistFormState = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_FORM, JSON.stringify(currentBeneficiaryFormData.value));
  };
  const persistListState = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(addedBeneficiariesList.value));
    demoStore.$patch({ beneficiaryInfo: JSON.parse(JSON.stringify(addedBeneficiariesList.value)) });
     initialStateForUnloadCheck.list = JSON.stringify(addedBeneficiariesList.value); // Update for unload check
  };

  const clearPersistedStates = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_FORM);
    localStorage.removeItem(LOCAL_STORAGE_KEY_LIST);
    // (demoStore as any).beneficiaryInfo might be cleared at a higher level (e.g. end of flow) or be explicitly managed
  };
  
  let initialStateForUnloadCheck = { form: '', list: '' };
  const hasUnsavedChanges = computed(() => {
    return JSON.stringify(currentBeneficiaryFormData.value) !== initialStateForUnloadCheck.form || 
           JSON.stringify(addedBeneficiariesList.value) !== initialStateForUnloadCheck.list;
  });

  const beforeUnloadHandler = (event) => {
    if (hasUnsavedChanges.value) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  };

  onMounted(() => {
    loadState();
    window.addEventListener('beforeunload', beforeUnloadHandler);
  });

  onBeforeUnmount(() => {
    componentMounted.value = false;
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    if (countdownTimer.value) {
      clearInterval(countdownTimer.value);
      countdownTimer.value = null;
    }
    // Only persist if component is still mounted and form has changes
    if (componentMounted.value && JSON.stringify(currentBeneficiaryFormData.value) !== initialStateForUnloadCheck.form) {
      persistFormState();
    }
  });

  // Add cleanup for form state
  onUnmounted(() => {
    // Clear any remaining state
    currentBeneficiaryFormData.value = { ...getDefaultBeneficiaryFormData() };
    currentBeneficiaryFieldErrors.value = {};
    formWideAlert.value = null;
    confirmRemoveDialog.value = false;
    beneficiaryIndexToRemove.value = null;
    countdown.value = 0;
    showCountdown.value = false;
  });

  watch(currentBeneficiaryFormData, persistFormState, { deep: true });
  // No direct watch on addedBeneficiariesList to call persistListState, it's called on add/remove.

  // --- Core Logic Methods ---
  const resetCurrentBeneficiaryForm = () => {
    currentBeneficiaryFormData.value = getDefaultBeneficiaryFormData();
    clearCurrentBeneficiaryFormErrors("");
    initialStateForUnloadCheck.form = JSON.stringify(currentBeneficiaryFormData.value);
  };

  const addCurrentBeneficiaryToList = async () => {
    clearCurrentBeneficiaryFormErrors("");
    formWideAlert.value = null;

    const validationResult = await validateCurrentBeneficiaryForm(currentBeneficiaryFormData.value);
    if (!validationResult.isValid) {
      if (Object.keys(currentBeneficiaryFieldErrors.value).length > 0 && !currentBeneficiaryFormAlert.value) {
        currentBeneficiaryFormAlert.value = 'Please correct errors in the beneficiary form.';
      }
      return false;
    }

    const currentPercent = parseFloat(currentBeneficiaryFormData.value.percent_of_beneficiary_interest || 0);
    if (totalPercentageAdded.value + currentPercent > 100) {
      formWideAlert.value = `Total percentage cannot exceed 100%. Remaining: ${remainingPercentageAvailable.value}%`;
      currentBeneficiaryFieldErrors.value.percent_of_beneficiary_interest = `Cannot exceed remaining ${remainingPercentageAvailable.value}%`;
      return false;
    }
    
    // Call Pinia store action to submit to API
    const submissionResult = await onboardingStore.submitBeneficiaryData(currentBeneficiaryFormData.value);

    if (submissionResult.success && submissionResult.data) {
      addedBeneficiariesList.value.push(submissionResult.data); // Add API confirmed data (with ID)
      persistListState();
      resetCurrentBeneficiaryForm();
      return true;
    } else {
      currentBeneficiaryFormAlert.value = submissionResult.generalMessage || 'Failed to add beneficiary.';
      if (submissionResult.fieldMessages) {
        currentBeneficiaryFieldErrors.value = { ...currentBeneficiaryFieldErrors.value, ...submissionResult.fieldMessages };
      }
      return false;
    }
  };

  const removeBeneficiary = (index) => {
    // In a real scenario, this might also call an API to delete the beneficiary from backend.
    // For now, it just removes from local list and updates demoStore.
    addedBeneficiariesList.value.splice(index, 1);
    persistListState();
  };

  const openConfirmRemoveDialog = (index) => {
    beneficiaryIndexToRemove.value = index;
    confirmRemoveDialog.value = true;
  };

  const executeRemoveBeneficiary = () => {
    if (beneficiaryIndexToRemove.value !== null) {
      removeBeneficiary(beneficiaryIndexToRemove.value);
    }
    confirmRemoveDialog.value = false;
    beneficiaryIndexToRemove.value = null;
  };
  
  const autoFillPercentage = () => {
    const currentTotal = totalPercentageAdded.value;
    const maxForCurrent = 100 - currentTotal;
    currentBeneficiaryFormData.value.percent_of_beneficiary_interest = Math.min(100, Math.max(0.01, maxForCurrent));
  };

  const startCountdown = () => {
    countdown.value = 30;
    showCountdown.value = true;
    countdownTimer.value = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        showCountdown.value = false;
        if (countdownTimer.value) {
          clearInterval(countdownTimer.value);
          countdownTimer.value = null;
        }
      }
    }, 1000);
  };

  return {
    currentBeneficiaryFormData,
    addedBeneficiariesList,
    currentBeneficiaryFieldErrors,
    currentBeneficiaryFormAlert,
    formWideAlert,
    validateCurrentBeneficiaryForm, // Expose for component to call on its own submit if needed

    clearCurrentBeneficiaryFormErrors,
    resetCurrentBeneficiaryForm,
    addCurrentBeneficiaryToList,
    openConfirmRemoveDialog,
    executeRemoveBeneficiary,
    confirmRemoveDialog, // state for dialog visibility
    totalPercentageAdded,
    remainingPercentageAvailable,
    autoFillPercentage,
    clearPersistedStates, // To be called on final submission of the whole onboarding flow
    hasUnsavedChanges,
    countdown,
    showCountdown,
    startCountdown,
  };
} 
