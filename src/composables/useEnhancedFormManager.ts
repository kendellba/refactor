import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAutoSave } from './useAutoSave.js';

export function useEnhancedFormManager(options = {} as any) {
  const {
    initialData = {},
    validationSchema = null,
    sensitiveFields = [],
    autoSaveInterval = 2000,
    enableEncryption = false,
    enableCrossTab = true,
    storageKey = null
  } = options;

  // Form state
  const formData = ref({ ...initialData });
  const fieldErrors = ref({});
  const serverError = ref(null);
  const isSubmitting = ref(false);
  const hasUnsavedChanges = ref(false);
  const showRecoveryDialog = ref(false);
  const recoveredData = ref(null);

  // Auto-save integration
  const {
    isDirty,
    isSaving,
    lastSaved,
    saveError,
    hasRecoverableData,
    draftCount,
    autoSave,
    forceSave,
    loadSavedData,
    clearSavedData,
    getDraftHistory
  } = useAutoSave({
    saveInterval: autoSaveInterval,
    storageKey,
    encryptSensitiveData: enableEncryption,
    sensitiveFields,
    enableCrossTabSync: enableCrossTab
  });

  // Computed
  const formState = computed(() => ({
    isDirty: isDirty.value || hasUnsavedChanges.value,
    isSaving: isSaving.value,
    isSubmitting: isSubmitting.value,
    hasErrors: Object.keys(fieldErrors.value).length > 0 || !!serverError.value,
    canSubmit: !isSubmitting.value && !isSaving.value && Object.keys(fieldErrors.value).length === 0
  }));

  const saveStatus = computed(() => {
    if (isSaving.value) return { text: 'Saving...', color: 'info', icon: 'mdi-loading' };
    if (saveError.value) return { text: 'Save failed', color: 'error', icon: 'mdi-alert' };
    if (lastSaved.value) return { text: 'Saved', color: 'success', icon: 'mdi-check' };
    return { text: 'Not saved', color: 'warning', icon: 'mdi-content-save-alert' };
  });

  // Form validation
  const validateField = async (fieldName) => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validateAt(fieldName, formData.value);
      if (fieldErrors.value[fieldName]) {
        delete fieldErrors.value[fieldName];
        fieldErrors.value = { ...fieldErrors.value };
      }
      return true;
    } catch (error) {
      fieldErrors.value = {
        ...fieldErrors.value,
        [fieldName]: error.message
      };
      return false;
    }
  };

  const validateForm = async () => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validate(formData.value, { abortEarly: false });
      fieldErrors.value = {};
      return true;
    } catch (error) {
      const errors = {};
      error.inner?.forEach(err => {
        errors[err.path] = err.message;
      });
      fieldErrors.value = errors;
      return false;
    }
  };

  // Data management
  const updateField = (fieldName, value) => {
    formData.value[fieldName] = value;
    hasUnsavedChanges.value = true;
    
    // Validate field on change
    validateField(fieldName);
    
    // Trigger auto-save
    autoSave(formData.value);
  };

  const updateFormData = (newData) => {
    formData.value = { ...formData.value, ...newData };
    hasUnsavedChanges.value = true;
    autoSave(formData.value);
  };

  const resetForm = () => {
    formData.value = { ...initialData };
    fieldErrors.value = {};
    serverError.value = null;
    hasUnsavedChanges.value = false;
    clearSavedData();
  };

  // Recovery functionality
  const checkForRecoverableData = () => {
    const saved = loadSavedData();
    if (saved && Object.keys(saved).length > 0) {
      recoveredData.value = saved;
      showRecoveryDialog.value = true;
      return true;
    }
    return false;
  };

  const restoreFromSaved = () => {
    if (recoveredData.value) {
      formData.value = { ...recoveredData.value };
      hasUnsavedChanges.value = false;
      showRecoveryDialog.value = false;
      
      // Validate restored data
      validateForm();
    }
  };

  const discardSavedData = () => {
    clearSavedData();
    recoveredData.value = null;
    showRecoveryDialog.value = false;
  };

  // Submission handling
  const submitForm = async (submitFn) => {
    try {
      isSubmitting.value = true;
      serverError.value = null;

      // Validate before submit
      const isValid = await validateForm();
      if (!isValid) {
        throw new Error('Please fix validation errors before submitting');
      }

      // Force save before submit
      forceSave(formData.value);

      // Execute submission
      const result = await submitFn(formData.value);

      if (result?.success) {
        // Clear saved data on successful submit
        clearSavedData();
        hasUnsavedChanges.value = false;
        return result;
      } else {
        // Handle submission errors
        if (result?.fieldErrors) {
          fieldErrors.value = { ...fieldErrors.value, ...result.fieldErrors };
        }
        if (result?.message) {
          serverError.value = result.message;
        }
        throw new Error(result?.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      if (!serverError.value) {
        serverError.value = error.message;
      }
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  // Navigation warning
  const beforeUnloadHandler = (event) => {
    if (hasUnsavedChanges.value || isDirty.value) {
      event.preventDefault();
      event.returnValue = '';
      return '';
    }
  };

  const setupBeforeUnloadWarning = () => {
    window.addEventListener('beforeunload', beforeUnloadHandler);
  };

  const clearBeforeUnloadWarning = () => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
  };

  // Auto-save watcher
  watch(
    formData,
    (newData) => {
      if (Object.keys(newData).length > 0) {
        hasUnsavedChanges.value = true;
        autoSave(newData);
      }
    },
    { deep: true }
  );

  // Lifecycle
  onMounted(() => {
    // Check for recoverable data on mount
    if (!checkForRecoverableData()) {
      // No recoverable data, start fresh
      formData.value = { ...initialData };
    }

    // Setup navigation warning
    setupBeforeUnloadWarning();
  });

  onBeforeUnmount(() => {
    // Force save on unmount
    if (hasUnsavedChanges.value) {
      forceSave(formData.value);
    }

    // Clean up warnings
    clearBeforeUnloadWarning();
  });

  // Return API
  return {
    // Form state
    formData,
    fieldErrors,
    serverError,
    formState,
    saveStatus,

    // Recovery state
    showRecoveryDialog,
    recoveredData,
    hasRecoverableData,
    lastSaved,
    draftCount,

    // Form methods
    updateField,
    updateFormData,
    validateField,
    validateForm,
    resetForm,
    submitForm,

    // Recovery methods
    restoreFromSaved,
    discardSavedData,
    getDraftHistory,

    // Save methods
    forceSave: () => forceSave(formData.value),
    clearSavedData,

    // Navigation
    setupBeforeUnloadWarning,
    clearBeforeUnloadWarning
  };
} 
