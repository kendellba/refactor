import { z } from 'zod';

export const membershipDeclarationSchema = z.object({
  isMemberOfAnotherCreditUnion: z.enum(['yes', 'no'], {
    required_error: 'Please select if you are a member of another credit union.',
  }),
  creditUnionName: z.string().optional(), // Optional by default, made required conditionally
  isServingOnBoard: z.enum(['yes', 'no'], {
    required_error: 'Please select if you are serving on another board/committee.',
  }),
  creditUnionBoardName: z.string().optional(), // Optional by default, made required conditionally
}).superRefine((data, ctx) => {
  if (data.isMemberOfAnotherCreditUnion === 'yes') {
    if (!data.creditUnionName || data.creditUnionName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Credit union name is required.',
        path: ['creditUnionName'],
      });
    }
  }
  if (data.isServingOnBoard === 'yes') {
    if (!data.creditUnionBoardName || data.creditUnionBoardName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Board name is required.',
        path: ['creditUnionBoardName'],
      });
    }
  }
}); 