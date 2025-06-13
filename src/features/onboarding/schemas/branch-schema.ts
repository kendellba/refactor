import { z } from 'zod';

const contactMethods = ['phone', 'email'];
const contactTimes = ['8:00am to 12:00pm', '12:00pm to 4:00pm', 'Anytime 8:00am to 4:00pm'];
const branches = ['Port of Spain', 'Milford Rd, Tobago'];

export const branchSchema = z.object({
  selectedBranch: z.string({
    required_error: 'Branch selection is required.',
  }).refine(value => branches.includes(value), {
    message: 'Invalid branch selected.',
  }),
  preferredContactMethod: z.string({
    required_error: 'Preferred contact method is required.',
  }).refine(value => contactMethods.includes(value), {
    message: 'Invalid contact method selected.',
  }),
  bestContactTime: z.string({
    required_error: 'Best contact time is required.',
  }).refine(value => contactTimes.includes(value), {
    message: 'Invalid contact time selected.',
  }),
}); 