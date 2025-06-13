import { z } from 'zod';
import { VERIFICATION_CODE_LENGTH } from '@/features/onboarding/constants/email-verification-options.js';

export const emailVerificationSchema = z.object({
  verificationCode: z
    .string()
    .length(VERIFICATION_CODE_LENGTH, `Code must be ${VERIFICATION_CODE_LENGTH} digits`)
    .regex(/^[0-9]+$/, 'Code must be numeric'),
}); 