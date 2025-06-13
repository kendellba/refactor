import { z } from 'zod';
import { 
  OCCUPATIONS,
  BUSINESS_TYPES,
  EMPLOYMENT_STATUS_OPTIONS_RAW,
  MONTHLY_REMUNERATION_OPTIONS,
  VALUE_OF_ASSETS_OPTIONS,
  CHILD_CONTRIBUTION_OPTIONS,
  SOURCE_OF_FUNDS_OPTIONS,
  MAX_FILE_SIZE_BYTES
} from '@/features/onboarding/constants/employment-options.js';
import { COUNTRY_CODES_FOR_VALIDATION } from '@/features/onboarding/constants/address-options.js';

const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic E.164 format regex, can be adjusted

const fileSchema = z.instanceof(File).refine(
  (file) => file.size <= MAX_FILE_SIZE_BYTES,
  `File size should be less than ${MAX_FILE_SIZE_BYTES / (1024*1024)}MB.`
);
// Add more specific file type checks if needed, e.g., .refine(file => ['image/jpeg', 'application/pdf'].includes(file.type), 'Invalid file type')

// Create a function that returns the schema with conditional validation
export const createEmploymentSchema = (isChildAccount = false) => z.object({
  is_business_owner: z.boolean().optional(),
  employment_status: z.string().min(1, 'Employment status is required.')
                         .refine(val => EMPLOYMENT_STATUS_OPTIONS_RAW.includes(val), 'Invalid employment status'),
  
  employer_name: z.string().min(1, 'Employer/Business name is required.'),
  occupation: z.string().min(1, 'Occupation is required.')
                  .refine(val => OCCUPATIONS.includes(val), 'Invalid occupation'),
  custom_occupation: z.string().optional().or(z.literal('')),
  business_type: z.string().optional().or(z.literal('')),

  work_phone: z.string().optional().or(z.literal('')).refine(val => !val || phoneRegex.test(val), 'Invalid work phone number.'),
  address_line_1: z.string().min(1, 'Address is required.').min(2, 'Address must be at least 10 characters').max(60, 'Address must not exceed 60 characters'),
  address_line_2: z.string().optional().or(z.literal(''))
                    .refine(val => !val || (val.length >= 2 && val.length <= 60), 'Address line 2 must be between 10 and 60 characters if provided'),
  city: z.string().min(1, 'City is required.'),
  country: z.string().min(1, 'Country is required.').refine(val => COUNTRY_CODES_FOR_VALIDATION.includes(val), 'Invalid country selected.'),

  nis_number: z.string().optional().or(z.literal('')), // Add specific regex if format is known
  bir_number: z.string().optional().or(z.literal('')), // Add specific regex if format is known

  monthly_remuneration: z.string().min(1, 'Monthly remuneration is required.')
                           .refine(val => MONTHLY_REMUNERATION_OPTIONS.includes(val), 'Invalid monthly remuneration option'),
  value_of_assets: z.string().min(1, 'Value of assets is required.')
                        .refine(val => VALUE_OF_ASSETS_OPTIONS.includes(val), 'Invalid value of assets option'),

  // Conditional fields for child account
  child_account_contribution: isChildAccount 
    ? z.string().min(1, 'Child account contribution type is required.').refine(val => CHILD_CONTRIBUTION_OPTIONS.includes(val), 'Invalid contribution type')
    : z.string().optional().or(z.literal('')),
  child_account_contribution_amount: isChildAccount
    ? z.preprocess(
        val => val ? parseFloat(String(val)) : undefined,
        z.number({ invalid_type_error: 'Contribution amount must be a number.' }).positive('Amount must be positive.').min(1, 'Contribution amount is required.')
      )
    : z.preprocess(
    val => val ? parseFloat(String(val)) : undefined,
    z.number({ invalid_type_error: 'Contribution amount must be a number.' }).positive('Amount must be positive.').optional()
  ),

  source_of_funds_type: z.string().min(1, 'Source of funds is required.')
                            .refine(val => SOURCE_OF_FUNDS_OPTIONS.includes(val), 'Invalid source of funds'),
  
  proof_of_employment_files: z.array(fileSchema).min(1, 'At least one proof of employment file is required.'),
  
  // signup_id is added by system, not part of form data for Zod validation directly

}).superRefine((data, ctx) => {
  if (data.occupation === 'Other' && !data.custom_occupation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['custom_occupation'],
      message: 'Please specify your occupation.',
    });
  }
  if (data.is_business_owner === true && !data.business_type) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['business_type'],
      message: 'Business type is required for business owners.',
    });
  }
  if (data.is_business_owner === true && data.business_type && !BUSINESS_TYPES.includes(data.business_type)) {
     ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['business_type'],
      message: 'Invalid business type selected.',
    });
  }
  // Note: Child account validation is now handled conditionally based on isChildAccount parameter
}); 

// Default export for backward compatibility
export const employmentSchema = createEmploymentSchema(false);