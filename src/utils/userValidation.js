import { errorMessages } from '@/utils/errorMessages';

/**
 * Validates a name field with basic requirements
 * @param {string} value - The name value to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=true] - Whether the field is required
 * @param {number} [options.minLength=2] - Minimum length of the name
 * @param {string} [options.fieldName='Name'] - Name of the field for error messages
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateName = (value, options = {}) => {
  const { required = true, minLength = 2, fieldName = 'Name' } = options;

  // Check if required but not provided
  if (required && (!value || !value.trim())) {
    return errorMessages.validation.required(fieldName);
  }

  // Optional field that wasn't provided
  if (!required && (!value || !value.trim())) {
    return true;
  }

  // Validate minimum length
  if (value?.trim() && value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  return true;
};

/**
 * Validates an email address
 * @param {string} value - The email to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=true] - Whether the field is required
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateEmail = (value, options = {}) => {
  const { required = true } = options;

  // Check if required but not provided
  if (required && (!value || !value.trim())) {
    return errorMessages.validation.required('Email');
  }

  // Optional field that wasn't provided
  if (!required && (!value || !value.trim())) {
    return true;
  }

  // Email regex pattern
  const emailPattern = /.+@.+\..+/;
  if (!emailPattern.test(value)) {
    return errorMessages.validation.email;
  }

  return true;
};

/**
 * Validates a mobile number
 * @param {string} value - The mobile number to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=true] - Whether the field is required
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateMobileNumber = (value, options = {}) => {
  const { required = true } = options;

  // Check if required but not provided
  if (required && (!value || !value.trim())) {
    return errorMessages.validation.required('Mobile number');
  }

  // Optional field that wasn't provided
  if (!required && (!value || !value.trim())) {
    return true;
  }

  // Phone number must be 11 digits (ignoring spaces and dashes)
  if (!/^\d{11}$/.test(value.replace(/[\s-]/g, ''))) {
    return errorMessages.validation.mobile;
  }

  return true;
};

/**
 * Validates a date of birth
 * @param {string} value - Date string in YYYY-MM-DD format
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=true] - Whether the field is required
 * @param {boolean} [options.pastOnly=true] - Whether date must be in the past
 * @param {number} [options.minAge=0] - Minimum age in years (if specified)
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateDateOfBirth = (value, options = {}) => {
  const { required = true, pastOnly = true, minAge = 0 } = options;

  // Check if required but not provided
  if (required && !value) {
    return errorMessages.validation.required('Date of birth');
  }

  // Optional field that wasn't provided
  if (!required && !value) {
    return true;
  }

  const birthDate = new Date(value);
  const today = new Date();

  // Check if it's a valid date
  if (isNaN(birthDate.getTime())) {
    return 'Invalid date format';
  }

  // Check if date is in the past
  if (pastOnly && birthDate > today) {
    return 'Date of birth cannot be in the future';
  }

  // Check if person is older than minimum age
  if (minAge > 0) {
    const age = calculateAge(birthDate);
    if (age < minAge) {
      return `You must be at least ${minAge} years old`;
    }
  }

  return true;
};

/**
 * Calculate age based on date of birth
 * @param {Date|string} dobValue - Date object or date string representing birth date
 * @returns {number} - Age in years, or 0 if dobValue is invalid
 */
export const calculateAge = (dobValue) => {
  if (!dobValue) {
    return 0; // Return 0 for null, undefined, or empty string
  }

  const birthDate = dobValue instanceof Date ? dobValue : new Date(dobValue);

  if (isNaN(birthDate.getTime())) {
    return 0; // Return 0 for invalid dates
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Ensure birthDate is also at the start of the day for accurate comparison if timezones are a concern
  // However, for YYYY-MM-DD strings, new Date() usually interprets it as local midnight or UTC midnight.
  // For simplicity, if just comparing dates, this might be okay.

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age < 0 ? 0 : age; // Ensure age is not negative if birthDate is in the future (though schema should prevent this)
};

/**
 * Validates a password for strength
 * @param {string} value - The password to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=true] - Whether the field is required
 * @param {boolean} [options.requireLowercase=true] - Whether lowercase is required
 * @param {boolean} [options.requireUppercase=true] - Whether uppercase is required
 * @param {boolean} [options.requireNumber=true] - Whether a number is required
 * @param {boolean} [options.requireSpecial=true] - Whether a special character is required
 * @param {number} [options.minLength=8] - Minimum length of the password
 * @returns {Object} - Result object with validation details
 */
export const validatePassword = (value, options = {}) => {
  const {
    required = true,
    requireLowercase = true,
    requireUppercase = true,
    requireNumber = true,
    requireSpecial = true,
    minLength = 8,
  } = options;

  const result = {
    isValid: true,
    message: '',
    strength: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
      overall: 0,
    },
  };

  // Check if required but not provided
  if (required && (!value || !value.trim())) {
    result.isValid = false;
    result.message = errorMessages.validation.required('Password');
    return result;
  }

  // Optional field that wasn't provided
  if (!required && (!value || !value.trim())) {
    return result;
  }

  // Check password strength criteria
  result.strength.length = value.length >= minLength;
  result.strength.lowercase = /[a-z]/.test(value);
  result.strength.uppercase = /[A-Z]/.test(value);
  result.strength.number = /[0-9]/.test(value);
  result.strength.special = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

  // Calculate overall strength (0-5 scale)
  result.strength.overall = [
    result.strength.length,
    result.strength.lowercase,
    result.strength.uppercase,
    result.strength.number,
    result.strength.special,
  ].filter(Boolean).length;

  // Set validation message based on the first failing criteria
  if (requireLowercase && !result.strength.lowercase) {
    result.isValid = false;
    result.message = 'Password must contain at least one lowercase letter';
  } else if (requireUppercase && !result.strength.uppercase) {
    result.isValid = false;
    result.message = 'Password must contain at least one uppercase letter';
  } else if (requireNumber && !result.strength.number) {
    result.isValid = false;
    result.message = 'Password must contain at least one number';
  } else if (requireSpecial && !result.strength.special) {
    result.isValid = false;
    result.message = 'Password must contain at least one special character';
  } else if (value.length < minLength) {
    result.isValid = false;
    result.message = `Password must be at least ${minLength} characters`;
  }

  return result;
};

/**
 * Validates a password confirmation
 * @param {string} confirmValue - The confirmation password
 * @param {string} password - The original password to match against
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=true] - Whether the field is required
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validatePasswordConfirmation = (confirmValue, password, options = {}) => {
  const { required = true } = options;

  // Check if required but not provided
  if (required && (!confirmValue || !confirmValue.trim())) {
    return errorMessages.validation.required('Password confirmation');
  }

  // Optional field that wasn't provided
  if (!required && (!confirmValue || !confirmValue.trim())) {
    return true;
  }

  // Check if passwords match
  if (confirmValue !== password) {
    return errorMessages.validation.passwordMatch;
  }

  return true;
};

/**
 * Creates a debounced function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (fn, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export default {
  validateName,
  validateEmail,
  validateMobileNumber,
  validateDateOfBirth,
  calculateAge,
  validatePassword,
  validatePasswordConfirmation,
  debounce,
};
