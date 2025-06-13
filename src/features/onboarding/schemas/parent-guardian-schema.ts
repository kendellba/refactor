import { z } from 'zod';
import { FILE_SIZE_LIMIT, ALLOWED_FILE_TYPES } from '@/utils/fileValidation';

const fileSchema = z
  .instanceof(File, { message: 'A document is required.' })
  .refine((file) => file.size <= FILE_SIZE_LIMIT, `File size should be less than 5MB.`)
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, .png, and .pdf formats are supported.'
  );

export const parentGuardianSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  middle_name: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  mobile: z.string().min(1, 'Mobile number is required').regex(/^\d{11}$/, 'Mobile number must be 11 digits'),
  relationship_to_child: z.string().min(1, 'Relationship to child is required'),
  guardian_files: z.array(fileSchema).nonempty('At least one document is required'),
}); 