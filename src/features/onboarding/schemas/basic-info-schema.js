import { z } from 'zod';
import { GENDER_OPTIONS, ADULT_MARITAL_STATUS_OPTIONS, MINOR_MARITAL_STATUS_OPTIONS } from '@/features/onboarding/constants/basic-info-options.js';
import { countryList } from '@/shared/constants/countries.js';

const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize to start of day

const calculateAge = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const countryValues = countryList; // countryList is now a simple string array
const genderValues = GENDER_OPTIONS.map(g => g.value);
const adultMaritalStatusValues = ADULT_MARITAL_STATUS_OPTIONS.map(m => m.value);
const minorMaritalStatusValues = MINOR_MARITAL_STATUS_OPTIONS.map(m => m.value);

export const basicInfoSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }).max(100, { message: 'First name must be 100 characters or less' }),
  lastName: z.string().min(1, { message: 'Last name is required' }).max(100, { message: 'Last name must be 100 characters or less' }),
  otherName: z.string().max(100, { message: 'Other names must be 100 characters or less' }).optional().nullable(),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  mobileNumber: z.string()
    .min(1, { message: 'Mobile number is required' })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid mobile number format. Include country code if applicable e.g. +1234567890' }), // E.164 like regex, can be adjusted
  gender: z.string().min(1, { message: 'Gender is required' }).refine(val => genderValues.includes(val), { message: 'Invalid gender selection' }),
  dob: z.string().min(1, { message: 'Date of birth is required' })
    .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
    .refine(val => new Date(val) < today, { message: 'Date of birth cannot be in the future' }),
  isHomeschooled: z.boolean().optional(),
  schoolName: z.string().max(255, { message: 'School name must be 255 characters or less' }).optional().nullable(),
  hasForeignBankAccount: z.boolean().optional(),
  nationality: z.string().min(1, { message: 'Nationality is required' }).refine(val => countryValues.includes(val), { message: 'Invalid nationality selection' }),
  maritalStatus: z.string().min(1, { message: 'Marital status is required' }), // Validation refined below
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string().min(1, { message: 'Password confirmation is required' }),
  termsViewed: z.boolean().refine(val => val === true, { message: 'You must agree to the Terms and Conditions' }),
  financialAgreementViewed: z.boolean().refine(val => val === true, { message: 'You must agree to the Financial Declaration' }),
})
.superRefine((data, ctx) => {
  // Password confirmation
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    });
  }

  const age = calculateAge(data.dob);
  const isAdult = age >= 18;

  // Marital Status validation based on age
  if (isAdult) {
    if (!adultMaritalStatusValues.includes(data.maritalStatus)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maritalStatus'],
        message: 'Invalid marital status for an adult',
      });
    }
  } else { // Minor
    if (!minorMaritalStatusValues.includes(data.maritalStatus)) {
       ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maritalStatus'],
        message: 'Invalid marital status for a minor. Only \'Single\' is allowed.',
      });
    }
  }
  
  // School Name validation based on age and homeschooled status
  if (!isAdult && !data.isHomeschooled) {
    if (!data.schoolName || data.schoolName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['schoolName'],
        message: 'School name is required for minors who are not homeschooled',
      });
    }
  }
}); 