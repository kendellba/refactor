import { z } from 'zod';
import { 
  ID_TYPES as ALL_ID_TYPES, 
  DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE 
} from '@/features/onboarding/constants/id-options.js';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

const idTypeValues = ALL_ID_TYPES.map(it => it.value);

// Helper for ID number validation based on type
const validateIdNumberByType = (idNumber, idType) => {
  if (!idNumber) return false; // presence is checked by .min(1)
  switch (idType) {
    case 'National ID':
      return idNumber.length >= 6 && idNumber.length <= 11;
    case "Driver's License":
      return /^[A-Za-z0-9]{10}$/.test(idNumber);
    case 'Passport':
      return /^[A-Za-z0-9]{8}$/.test(idNumber);
    case 'Birth Certificate':
      return /^[A-Za-z0-9]{1,12}$/.test(idNumber);
    default:
      return true; // If type is not in list, skip specific format validation here
  }
};

const getIdNumberErrorMessage = (idType) => {
  switch (idType) {
    case 'National ID':
      return 'National ID must be 6-11 characters.';
    case "Driver's License":
      return 'Driver\'s License must be 10 alphanumeric characters.';
    case 'Passport':
      return 'Passport must be 8 alphanumeric characters.';
    case 'Birth Certificate':
      return 'Birth Certificate must be up to 12 alphanumeric characters.';
    default:
      return 'Invalid ID number format.';
  }
};

const fileSchema = z.instanceof(File, { message: 'ID document is required.' })
  .refine(file => file.size <= MAX_FILE_SIZE_BYTES, `File size should be less than ${MAX_FILE_SIZE_MB}MB.`)
  .refine(file => ALLOWED_FILE_TYPES.includes(file.type), 'Invalid file type. Only PDF, JPG, PNG allowed.');

// Schema for a single ID document set
const singleIdDocumentSchema = z.object({
  idType: z.string().min(1, 'ID type is required.').refine(val => idTypeValues.includes(val), 'Invalid ID type selected.'),
  idNumber: z.string().min(1, 'ID number is required.'),
  expiryDate: z.string().min(1, 'Expiry date is required.'),
  document: z.array(fileSchema).min(1, 'At least one ID document is required.').max(1, 'Only one file per ID document is allowed.'), // Assuming one file per ID based on original UI
});

export const idInformationSchema = z.object({
  firstIdType: z.string().min(1, 'Primary ID type is required.').refine(val => idTypeValues.includes(val), 'Invalid primary ID type.'),
  firstIdNumber: z.string().min(1, 'Primary ID number is required.'),
  firstExpiryDate: z.string().min(1, 'Primary ID expiry date is required.'),
  firstIdDocument: z.array(fileSchema).min(1, 'Primary ID document is required.').max(1, 'Only one file for primary ID.'),

  secondIdType: z.string().min(1, 'Secondary ID type is required.').refine(val => idTypeValues.includes(val), 'Invalid secondary ID type.'),
  secondIdNumber: z.string().min(1, 'Secondary ID number is required.'),
  secondExpiryDate: z.string().min(1, 'Secondary ID expiry date is required.'),
  secondIdDocument: z.array(fileSchema).min(1, 'Secondary ID document is required.').max(1, 'Only one file for secondary ID.'),
}).superRefine((data, ctx) => {
  // Validate First ID Number based on Type
  if (data.firstIdType && data.firstIdNumber) {
    if (!validateIdNumberByType(data.firstIdNumber, data.firstIdType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['firstIdNumber'],
        message: getIdNumberErrorMessage(data.firstIdType),
      });
    }
  }
  // Validate Second ID Number based on Type
  if (data.secondIdType && data.secondIdNumber) {
    if (!validateIdNumberByType(data.secondIdNumber, data.secondIdType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['secondIdNumber'],
        message: getIdNumberErrorMessage(data.secondIdType),
      });
    }
  }

  // Ensure First and Second ID types are different
  if (data.firstIdType && data.secondIdType && data.firstIdType === data.secondIdType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['secondIdType'],
      message: 'Secondary ID type must be different from primary ID type.',
    });
  }

  // Validate Expiry Dates (must be in future, unless Birth Certificate)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (data.firstIdType !== 'Birth Certificate' && data.firstExpiryDate) {
    const firstExpiry = new Date(data.firstExpiryDate);
    if (firstExpiry <= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['firstExpiryDate'],
        message: 'Primary ID expiry date must be in the future.',
      });
    }
  }

  if (data.secondIdType !== 'Birth Certificate' && data.secondExpiryDate) {
    const secondExpiry = new Date(data.secondExpiryDate);
    if (secondExpiry <= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['secondExpiryDate'],
        message: 'Secondary ID expiry date must be in the future.',
      });
    }
  }
});

