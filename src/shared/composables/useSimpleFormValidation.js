import { ref } from 'vue';
import { z } from 'zod';

export function useSimpleFormValidation(schema) {
  const errors = ref({});
  const serverError = ref(''); // For general server errors not tied to a field

  const validate = async (formData) => {
    errors.value = {}; // Clear previous client-side errors
    serverError.value = ''; // Clear previous server error

    const result = await schema.safeParseAsync(formData);

    if (!result.success) {
      const newErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.'); // Zod paths are typically direct field names
        if (!newErrors[path]) { // Only take the first error for a given path
          newErrors[path] = issue.message;
        }
      }
      errors.value = newErrors;
      return { isValid: false, errors: newErrors };
    }
    return { isValid: true, errors: {} };
  };

  const parseApiErrors = (errorResponseData, apiFieldMapping = {}) => {
    const newFieldErrors = {};
    let generalErrorMessage = '';

    if (errorResponseData && errorResponseData.detail) {
      const details = errorResponseData.detail;
      if (typeof details === 'string') {
        generalErrorMessage = details;
      } else if (Array.isArray(details)) {
        details.forEach(err => {
          if (err.loc && err.loc.length > 1) {
            const apiFieldKey = err.loc[1];
            const formFieldKey = apiFieldMapping[apiFieldKey] || apiFieldKey;
            if (!newFieldErrors[formFieldKey]) {
              newFieldErrors[formFieldKey] = err.msg;
            }
          } else if (err.msg) {
            generalErrorMessage = generalErrorMessage ? `${generalErrorMessage}; ${err.msg}` : err.msg;
          }
        });
      } else if (typeof details === 'object') { // Fallback for other object structures
        for (const key in details) {
            const formFieldKey = apiFieldMapping[key] || key;
            if (details[key] && !newFieldErrors[formFieldKey]) {
                 newFieldErrors[formFieldKey] = Array.isArray(details[key]) ? details[key].join(', ') : details[key];
            }
        }
      }
    } else if (typeof errorResponseData === 'string') { // If the whole error is a string
        generalErrorMessage = errorResponseData;
    }

    // Update reactive refs
    // Prioritize API errors for specific fields by overwriting
    errors.value = { ...errors.value, ...newFieldErrors }; 
    if (generalErrorMessage) {
        serverError.value = generalErrorMessage;
    }
    
    return { errors: newFieldErrors, serverError: generalErrorMessage };
  };

  const validateFormField = async (fieldName, formData) => {
    // Clear the specific field error first
    if (errors.value[fieldName]) {
      delete errors.value[fieldName];
      errors.value = { ...errors.value };
    }
    
    // If formData is provided, validate just that field
    if (formData && formData[fieldName] !== undefined) {
      try {
        // Create a temporary schema for just this field
        const fieldSchema = schema.shape[fieldName];
        if (fieldSchema) {
          const result = await fieldSchema.safeParseAsync(formData[fieldName]);
          if (!result.success && result.error.issues.length > 0) {
            errors.value = { ...errors.value, [fieldName]: result.error.issues[0].message };
          }
        }
      } catch (error) {
        // Silently ignore validation errors for individual fields
      }
    }
  };

  const clearErrors = (fieldName) => {
    if (fieldName) {
      if (errors.value[fieldName]) {
        delete errors.value[fieldName];
        errors.value = { ...errors.value }; // Trigger reactivity by creating a new object
      }
    } else {
      errors.value = {};
      serverError.value = '';
    }
  };

  return {
    errors,
    serverError,
    validate,
    validateFormField,
    parseApiErrors,
    clearErrors,
  };
} 