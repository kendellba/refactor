import { z } from 'zod';
import { relationshipOptions } from '@/features/onboarding/constants/poa-options.ts';
import { countryList, COUNTRY_CODES_FOR_VALIDATION } from '@/features/onboarding/constants/address-options.js';

// Define idTypes directly as a readonly tuple for Zod enum compatibility
const idTypes = [
  'National ID',
  'Passport',
  "Driver's License", 
  'Other Government ID'
] as const;

const nonEmptyString = (message) => z.string().trim().min(1, { message });

// Regex for basic phone validation (allows digits, spaces, hyphens, parentheses, plus sign)
// More specific validation might be needed depending on requirements.
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

// File validation: check if it's a File object. Max size can be added here.
const fileSchema = z.instanceof(File, { message: 'Invalid file type.' })
  .refine(file => file.size <= 5 * 1024 * 1024, `File size should be 5MB or less.`) // Example: 5MB limit
  .optional()
  .nullable(); // Allow null if no file is selected

export const poaSchema = z.object({
  first_name: nonEmptyString('First name is required').min(2, 'First name must be at least 2 characters'),
  last_name: nonEmptyString('Last name is required').min(2, 'Last name must be at least 2 characters'),
  middle_name: z.string().optional(),
  dob: nonEmptyString('Date of birth is required').refine(val => {
    const date = new Date(val);
    if (isNaN(date.getTime())) return false; // Invalid date format
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age >= 18;
  }, 'Must be at least 18 years old'),
  gender: z.enum(['Male', 'Female'], { required_error: 'Gender is required' }),
  email: nonEmptyString('Email is required').email({ message: 'Invalid email address' }),
  phone: nonEmptyString('Phone number is required').regex(phoneRegex, { message: 'Invalid phone number format' }),
  relationship_to_principal: z.string({ required_error: 'Relationship to Principal is required' })
                           .refine(val => relationshipOptions.includes(val), { message: 'Invalid relationship selected' }),
  
  // Address
  address_line_1: nonEmptyString('Address Line 1 is required'),
  address_line_2: z.string().optional(),
  city: nonEmptyString('City is required'),
  country: z.string({ required_error: 'Country is required' })
             .refine(val => COUNTRY_CODES_FOR_VALIDATION.includes(val), { message: 'Invalid country selected' }),

  // Identification
  id_type: z.enum(idTypes, { required_error: 'ID type is required' }),
  id_number: nonEmptyString('ID number is required'),
  
  // Files - Allow FileList or single File, making them optional at field level
  // The .refine at the object level will check if at least one is provided.
  // Using z.any() for now, specific file type/size checks can be added in .refine or via a custom z.preprocess
  id_document: z.any().optional().nullable(), // Placeholder for actual file validation
  power_of_attorney_document: z.any().optional().nullable(), // Placeholder
})
.superRefine((data, ctx) => {
  // Conditional ID Number Validation
  if (data.id_type && data.id_number) {
    let validId = true;
    let message = '';
    switch (data.id_type) {
      case 'National ID':
        if (data.id_number.length < 6 || data.id_number.length > 11) {
          validId = false; message = 'National ID must be between 6 and 11 characters';
        }
        break;
      case "Driver's License":
        if (!/^[A-Za-z0-9]{10}$/.test(data.id_number)) {
          validId = false; message = "Driver's License must be 10 alphanumeric characters";
        }
        break;
      case 'Passport':
        if (!/^[A-Za-z0-9]{8}$/.test(data.id_number)) {
          validId = false; message = 'Passport must be 8 alphanumeric characters';
        }
        break;
      // case 'Birth Certificate': // Not in the provided idTypes list for POA
      //   if (!/^[A-Za-z0-9]{1,12}$/.test(data.id_number)) {
      //     validId = false; message = 'Birth Certificate must be up to 12 alphanumeric characters';
      //   }
      //   break;
      case 'Other Government ID': // No specific format, just ensure it's there
        if (data.id_number.trim() === '') {
            validId = false; message = 'ID number is required for Other Government ID';
        }
        break;
    }
    if (!validId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: message,
        path: ['id_number'],
      });
    }
  }

  // Check if at least one document is uploaded
  // The actual file objects might be in data.id_document or data.power_of_attorney_document
  // This check assumes that if a file is selected, the field will not be null/undefined.
  // For v-file-input, an unselected field might be null or an empty array.
  // We'll check for presence. If it's an array, check length. If single, check for non-null.
  const idDoc = data.id_document;
  const poaDoc = data.power_of_attorney_document;

  const hasIdDoc = idDoc && (Array.isArray(idDoc) ? idDoc.length > 0 : idDoc instanceof File);
  const hasPoaDoc = poaDoc && (Array.isArray(poaDoc) ? poaDoc.length > 0 : poaDoc instanceof File);

  if (!hasIdDoc && !hasPoaDoc) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one document (ID Document or Power of Attorney Document) must be uploaded.',
      // Add path to one of the fields, or make it a form-level error by not specifying path
      path: ['id_document'], // Or 'power_of_attorney_document' or no path for form-level
    });
  }
});

// Helper for file validation rules (can be used in component with useSimpleFormValidation if needed)
// export const fileValidationRules = {
//   allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
//   maxSizeMB: 5,
// }; 