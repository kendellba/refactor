import { z } from 'zod';

export const mobileVerificationSchema = z.object({
  verificationCode: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
}); 