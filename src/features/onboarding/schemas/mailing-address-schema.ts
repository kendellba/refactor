import { z } from 'zod';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

const fileSchema = z
  .instanceof(File, { message: 'Please upload a file.' })
  .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, `File size must be less than ${MAX_FILE_SIZE_MB}MB.`)
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'Invalid file type. Only JPG, PNG, and PDF are allowed.'
  );

// Optional file array for when sameAsResidential is true
const optionalFileArraySchema = z.array(fileSchema).optional();
// Required file array for when sameAsResidential is false
const requiredFileArraySchema = z.array(fileSchema).min(1, 'Proof of Address is required. Please upload at least one file.');

export const mailingAddressSchema = z.object({
  sameAsResidential: z.boolean().default(false),
  address_line_1: z.string().max(100, 'Address must not exceed 100 characters'),
  address_line_2: z.string().max(100, 'Address Line 2 must be at most 100 characters long.').optional().or(z.literal('')),
  city: z.string().max(60, 'City must not exceed 60 characters'),
  country: z.string(),
  proof_of_address_files: z.any() // We'll refine this based on sameAsResidential
}).superRefine((data, ctx) => {
  if (!data.sameAsResidential) {
    if (!data.address_line_1 || data.address_line_1.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address_line_1'],
        message: 'Address Line 1 is required and must be at least 3 characters',
      });
    }
    if (!data.city || data.city.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['city'],
        message: 'City is required and must be at least 3 characters',
      });
    }
    if (!data.country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['country'],
        message: 'Country is required',
      });
    }
    // Validate proof_of_address_files
    const proofValidation = requiredFileArraySchema.safeParse(data.proof_of_address_files);
    if (!proofValidation.success) {
      proofValidation.error.errors.forEach(err => {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['proof_of_address_files'],
            message: err.message
        })
      });
    }
  } else {
    // If sameAsResidential is true, ensure files are optional or not validated against required criteria
    const proofValidation = optionalFileArraySchema.safeParse(data.proof_of_address_files);
    if (!proofValidation.success) {
        // This case might occur if an invalid file type is present even when optional
        proofValidation.error.errors.forEach(err => {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['proof_of_address_files'],
                message: err.message
            })
        });
    }
  }
}); 