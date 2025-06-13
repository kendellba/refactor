import { z } from 'zod';
import { COUNTRY_CODES_FOR_VALIDATION } from '@/features/onboarding/constants/address-options.js'; // Updated import
import { RELATIONSHIP_OPTIONS, BENEFICIARY_ID_TYPES } from '@/features/onboarding/constants/beneficiary-options.js';

const beneficiaryIdTypeValues = BENEFICIARY_ID_TYPES.map(it => it.value);
// const countryValues = COUNTRY_LIST_FOR_VALIDATION.map(c => c.value); // No longer needed like this

// Validation logic for ID numbers, adapted from component
const validateBeneficiaryIdNumberByType = (idType, idNumber) => {
  if (!idNumber) return true; // Presence is checked by .min(1)
  switch (idType) {
    case 'National ID':
      return /^.{6,11}$/.test(idNumber) || 'National ID must be 6-11 characters.';
    case 'Drivers License': // Value from BENEFICIARY_ID_TYPES
      return /^[A-Za-z0-9]{10}$/.test(idNumber) || 'Driver\'s License must be 10 alphanumeric characters.';
    case 'Passport':
      return /^[A-Za-z0-9]{8,9}$/.test(idNumber) || 'Passport must be 8-9 alphanumeric characters.';
    // Birth Certificate was in component's original helper, but not in ID_TYPES for beneficiary, so removed for now.
    default:
      return true;
  }
};

export const beneficiarySchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters.'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters.'),
  middle_name: z.string().optional().or(z.literal('')),
  dob: z.string().min(1, 'Date of birth is required.').refine(val => !isNaN(new Date(val).getTime()), 'Invalid date format.')
    .refine(val => new Date(val) < new Date(), 'Date of birth must be in the past.'),
  gender: z.string().min(1, 'Gender is required.').refine(val => ['Male', 'Female', 'Other'].includes(val), 'Invalid gender selected.'), // Assuming Male/Female from component
  
  address_line_1: z.string().min(1, 'Address line 1 is required.'),
  address_line_2: z.string().optional().or(z.literal('')),
  city: z.string().min(1, 'City is required.'),
  country: z.string().min(1, 'Country is required.').refine(val => COUNTRY_CODES_FOR_VALIDATION.includes(val), 'Invalid country selected.'), // Updated to use COUNTRY_CODES_FOR_VALIDATION
  
  relationship_to_beneficiary: z.string().min(1, 'Relationship is required.').refine(val => RELATIONSHIP_OPTIONS.includes(val), 'Invalid relationship selected.'),
  
  id_type: z.string().min(1, 'ID type is required.').refine(val => beneficiaryIdTypeValues.includes(val), 'Invalid ID type selected.'),
  id_number: z.string().min(1, 'ID number is required.'),
  
  percent_of_beneficiary_interest: z.preprocess(
    val => parseFloat(String(val)),
    z.number({
      required_error: 'Percentage of interest is required.',
      invalid_type_error: 'Percentage must be a number.'
    }).min(0.01, 'Percentage must be greater than 0.').max(100, 'Percentage cannot exceed 100.')
  ),
  
  // signup_id is not part of individual beneficiary form validation, but added by system when submitting
}).superRefine((data, ctx) => {
  const idNumberValidation = validateBeneficiaryIdNumberByType(data.id_type, data.id_number);
  if (typeof idNumberValidation === 'string') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['id_number'],
      message: idNumberValidation,
    });
  }
});

// This schema is for one beneficiary. The logic to manage a list of beneficiaries 
// (e.g., ensuring total percentage is 100%) will be handled by a form manager or component. 