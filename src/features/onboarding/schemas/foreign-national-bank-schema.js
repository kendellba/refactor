import { z } from 'zod';
import { COUNTRY_CODES_FOR_VALIDATION } from '@/features/onboarding/constants/address-options.js';

// Regex for basic E.164 phone format, can be refined based on specific needs
// The original component used /\d{11}/ after stripping, let's make it flexible for international numbers but still validate structure.
const phoneRegex = /^\+?[1-9]\d{6,14}$/; // Allows optional + and 7-15 digits total.
const accountNumberRegex = /^[a-zA-Z0-9]{8,30}$/;
const swiftCodeRegex = /^[A-Z0-9]{8,11}$/;

export const foreignNationalBankSchema = z.object({
  bank_name: z.string().min(1, 'Bank name is required.').max(100, 'Bank name must be 100 characters or less.'),
  account_number: z.string()
    .min(1, 'Account number is required.')
    .transform(val => val.replace(/[\s-]/g, '')) // Clean before validation
    .refine(val => accountNumberRegex.test(val), 'Account number must be 8-30 alphanumeric characters.'),
  
  swift_code: z.string().optional().or(z.literal(''))
    .transform(val => val ? val.trim() : '')
    .refine(val => !val || swiftCodeRegex.test(val), 'SWIFT code must be 8-11 alphanumeric characters if provided.'),

  address_line_1: z.string().min(1, 'Bank address is required.').min(3, 'Bank address must be at least 3 characters.').max(60, 'Bank address must not exceed 60 characters.'),
  address_line_2: z.string().optional().or(z.literal(''))
    .refine(val => !val || (val.length >= 3 && val.length <= 60), 'Bank address line 2 must be between 3 and 60 characters if provided.'),
  city: z.string().min(1, 'City is required.').min(3, 'City must be at least 3 characters.').max(60, 'City must not exceed 60 characters.'),
  country: z.string().min(1, 'Country is required.')
    .refine(val => COUNTRY_CODES_FOR_VALIDATION.includes(val), 'Invalid country selected.'),
  
  phone: z.string().min(1, 'Bank telephone number is required.')
    .transform(val => val.replace(/[\s-()]/g, '')) // Clean before validation
    .refine(val => phoneRegex.test(val), 'Invalid bank telephone number format. Use international format if applicable (e.g., +12223334444).'),
  
  // signup_id is typically added by the system/store, not part of user form data for Zod validation directly.
}); 