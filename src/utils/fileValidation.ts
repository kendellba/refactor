// File validation utilities with TypeScript interfaces

interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  required?: boolean;
  fieldName?: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (file: File | null, options: FileValidationOptions = {}): ValidationResult => {
  const { maxSize = 20 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'], required = true, fieldName = 'Document' } = options;
  if (required && !file) return { isValid: false, error: fieldName + ' is required' };
  if (!file) return { isValid: true };
  if (file.size > maxSize) return { isValid: false, error: fieldName + ' must be smaller than ' + (maxSize / 1024 / 1024) + 'MB' };
  if (!allowedTypes.includes(file.type)) return { isValid: false, error: 'Invalid file type for ' + fieldName };
  return { isValid: true };
};


export const FILE_SIZE_LIMIT = 20 * 1024 * 1024; export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
