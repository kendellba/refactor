import { errorMessages } from '@/utils/errorMessages';

// Export constants for direct use
export const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

/**
 * Default file validation options
 */
export const DEFAULT_FILE_OPTIONS = {
  maxSize: FILE_SIZE_LIMIT,
  allowedTypes: ALLOWED_FILE_TYPES,
  required: true,
};

/**
 * Validates files against size and type constraints
 * @param {File|File[]} files - File or array of files to validate
 * @param {Object} options - Validation options
 * @param {number} [options.maxSize=20971520] - Maximum file size in bytes (default: 20MB)
 * @param {string[]} [options.allowedTypes=['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']] - Allowed file types
 * @param {boolean} [options.required=true] - Whether the file is required
 * @param {string} [options.fieldName='Document'] - Name of the field for error messages
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateFile = (files, options = {}) => {
  const {
    maxSize = 20 * 1024 * 1024, // 20MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    required = true,
    fieldName = 'Document',
  } = options;

  // Check if files are provided when required
  if (!files || (Array.isArray(files) && files.length === 0)) {
    return required ? errorMessages.validation.required(fieldName) : true;
  }

  const fileArray = Array.isArray(files) ? files : [files];

  // Validate each file
  for (const file of fileArray) {
    // Size validation
    if (file.size > maxSize) {
      return errorMessages.file.sizeLimit(maxSize);
    }

    // Type validation
    if (!allowedTypes.includes(file.type)) {
      return errorMessages.file.invalidFormat;
    }
  }

  return true;
};

/**
 * Creates a file validation rule suitable for Vuetify's rules prop
 * @param {Object} options - Same options as validateFile
 * @returns {function} - Validation function
 */
export const createFileValidationRule = (options = {}) => {
  return (files) => validateFile(files, options);
};

/**
 * Validates proof of address documents
 * @param {File|File[]} files - File or array of files to validate
 * @param {Object} options - Override default options
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateProofOfAddress = (files, options = {}) => {
  return validateFile(files, {
    fieldName: 'Proof of address',
    ...options,
  });
};

/**
 * Validates identification documents
 * @param {File|File[]} files - File or array of files to validate
 * @param {Object} options - Override default options
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateIdentificationDocument = (files, options = {}) => {
  return validateFile(files, {
    fieldName: 'Identification document',
    ...options,
  });
};

/**
 * Validates power of attorney documents
 * @param {File|File[]} files - File or array of files to validate
 * @param {Object} options - Override default options
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validatePowerOfAttorneyDocument = (files, options = {}) => {
  return validateFile(files, {
    fieldName: 'Power of attorney document',
    ...options,
  });
};

/**
 * Validates beneficiary documents
 * @param {File|File[]} files - File or array of files to validate
 * @param {Object} options - Override default options
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validateBeneficiaryDocument = (files, options = {}) => {
  return validateFile(files, {
    fieldName: 'Beneficiary document',
    ...options,
  });
};

export default {
  validateFile,
  createFileValidationRule,
  validateProofOfAddress,
  validateIdentificationDocument,
  validatePowerOfAttorneyDocument,
  validateBeneficiaryDocument,
};
