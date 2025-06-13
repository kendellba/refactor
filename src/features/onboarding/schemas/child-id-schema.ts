import { z } from 'zod';
import { 
  ID_TYPES as ALL_ID_TYPES, 
  DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE 
} from '@/features/onboarding/constants/id-options.js';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

const idTypeValues = ALL_ID_TYPES.map(it => it.value);

const fileSchema = z.instanceof(File, { message: 'ID document is required.' })
  .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 20MB.`)
  .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), 'Invalid file type. Allowed types: PDF, JPG, PNG.');

// Schema for a single ID document group (first or second)
const idDocumentGroupSchema = z.object({
  idType: z.string().refine(val => idTypeValues.includes(val), 'Invalid ID type selected.'),
  idNumber: z.string().min(1, 'ID number is required.'),
  expiryDate: z.string().min(1, 'Expiry date is required.'),
  idDocument: z.array(fileSchema).min(1, 'At least one ID document is required.').max(5, 'You can upload a maximum of 5 files.'), // Allowing multiple files
});

// Specific validation rules for ID numbers - these can be expanded
const validateIdNumberByType = (idType, idNumber) => {
  if (!idNumber) return true; // Requirement is handled by .min(1)
  switch (idType) {
    case 'National ID':
      return /^[a-zA-Z0-9]{6,11}$/.test(idNumber) || 'National ID must be 6-11 alphanumeric characters.';
    case 'Passport':
      return /^[a-zA-Z0-9]{8,9}$/.test(idNumber) || 'Passport must be 8-9 alphanumeric characters.'; // Common lengths
    case 'Birth Certificate':
      return /^[a-zA-Z0-9]{1,20}$/.test(idNumber) || 'Birth Certificate number seems invalid (max 20 chars).';
    default:
      return true;
  }
};

export const childIdSchema = z.object({
  firstIdType: z.string({ required_error: 'First ID type is required.' }).refine(val => idTypeValues.includes(val), 'Invalid ID type selected.'),
  firstIdNumber: z.string().min(1, 'First ID number is required.'),
  firstExpiryDate: z.string().min(1, 'First ID expiry date is required.'),
  firstIdDocument: z.array(fileSchema).min(1, 'At least one first ID document is required.').max(5, 'You can upload a maximum of 5 files for the first ID.'),
  
  hasSecondId: z.boolean(),

  secondIdType: z.string().optional(),
  secondIdNumber: z.string().optional(),
  secondExpiryDate: z.string().optional(),
  secondIdDocument: z.array(fileSchema).max(5, 'You can upload a maximum of 5 files for the second ID.').optional(), // Optional array
})
.superRefine((data, ctx) => {
  // Validate first ID number based on type
  const firstIdNumberValidation = validateIdNumberByType(data.firstIdType, data.firstIdNumber);
  if (typeof firstIdNumberValidation === 'string') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['firstIdNumber'],
      message: firstIdNumberValidation,
    });
  }

  // Validate first expiry date
  if (data.firstIdType !== 'Birth Certificate') {
    if (new Date(data.firstExpiryDate) <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['firstExpiryDate'],
        message: 'First ID expiry date must be in the future.',
      });
    }
  } else if (data.firstExpiryDate !== DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE) {
     // Optionally enforce the default for birth cert or allow it to be set by component
     // For now, if it is birth cert, we assume component sets it correctly or it's not validated against default here.
  }

  // Conditional validation for second ID
  if (data.hasSecondId) {
    if (!data.secondIdType) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['secondIdType'], message: 'Second ID type is required if providing a second ID.' });
    }
    if (!data.secondIdNumber) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['secondIdNumber'], message: 'Second ID number is required if providing a second ID.' });
    }
    if (!data.secondExpiryDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['secondExpiryDate'], message: 'Second ID expiry date is required if providing a second ID.' });
    }
    if (!data.secondIdDocument || data.secondIdDocument.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['secondIdDocument'], message: 'Second ID document is required if providing a second ID.' });
    }

    // Validate second ID number based on type
    if (data.secondIdType && data.secondIdNumber) {
        const secondIdNumberValidation = validateIdNumberByType(data.secondIdType, data.secondIdNumber);
        if (typeof secondIdNumberValidation === 'string') {
            ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['secondIdNumber'],
            message: secondIdNumberValidation,
            });
        }
    }
    
    // Ensure second ID type is different from first
    if (data.firstIdType && data.secondIdType && data.firstIdType === data.secondIdType) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['secondIdType'],
            message: 'Second ID type must be different from the first ID type.',
        });
    }

    // Validate second expiry date
    if (data.secondIdType && data.secondIdType !== 'Birth Certificate' && data.secondExpiryDate) {
      if (new Date(data.secondExpiryDate) <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['secondExpiryDate'],
          message: 'Second ID expiry date must be in the future.',
        });
      }
    }
  }
}); 