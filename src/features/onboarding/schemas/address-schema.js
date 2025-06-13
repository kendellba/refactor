import { z } from 'zod';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_PDF_TYPE = 'application/pdf';
const ACCEPTED_FILE_TYPES = [...ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPE];

const fileSchema = z
  .instanceof(File, { message: 'Please upload a file.' })
  .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, `File size must be less than ${MAX_FILE_SIZE_MB}MB.`)
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'Invalid file type. Only images (JPEG, PNG, WEBP) and PDFs are allowed.'
  );

export const addressSchema = z.object({
  addressLine1: z.string().min(3, 'Address Line 1 must be at least 3 characters long.').max(100, 'Address Line 1 must be at most 100 characters long.'),
  addressLine2: z.string().max(100, 'Address Line 2 must be at most 100 characters long.').optional().or(z.literal('')), // Optional, can be empty string
  city: z.string().min(2, 'City must be at least 2 characters long.').max(50, 'City must be at most 50 characters long.'),
  country: z.string().nonempty('Country is required.'),
  dwellingStatus: z.string().nonempty('Dwelling Status is required.'),
  utilityBillType: z.string().nonempty('Utility Bill Type is required.'),
  proofOfAddress: z
    .preprocess((arg) => {
      // Handle single file or array of files, or null
      if (!arg) return []; // Treat null/undefined as empty array for validation
      if (Array.isArray(arg)) return arg;
      return [arg]; // Wrap single file in array
    }, z.array(fileSchema).min(1, 'Proof of Address is required. Please upload at least one file.'))
    .refine((files) => files.every(file => file instanceof File), {
      message: "Expected an array of files.", // Should be caught by fileSchema if individual items are not files
    }),
});

export const validateField = async (schema, field, value, allData) => {
  try {
    await schema.pick({ [field]: true }).parseAsync({ [field]: value, ...allData }); // Include allData for context if schema has superRefine or dependent fields
    return { valid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message || 'Invalid value' };
    }
    return { valid: false, error: 'An unexpected error occurred during validation.' };
  }
}; 