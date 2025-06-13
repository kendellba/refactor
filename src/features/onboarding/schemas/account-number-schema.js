import { z } from 'zod';

export const accountNumberSchema = z.object({
  account_number: z.string().min(1, 'Account number is required'),
}); 