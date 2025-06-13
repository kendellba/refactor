import { z } from 'zod';

export const pepSchema = z.object({
  isPEP: z.boolean({ required_error: 'Please indicate if you are a Politically Exposed Person or related to one.' }),
  domestic_foreign_roles: z.array(z.string()).optional(),
  immediate_family_members: z.array(z.string()).optional(),
  international_roles: z.array(z.string()).optional(),
  jobTitle: z.string().optional(), // Optional for now, will be refined
  is_close_associate: z.enum(['yes', 'no'], { required_error: 'Please indicate if you are an associate of a PEP.' }),
  relationship_type: z.string().optional(), // Optional for now, will be refined
  associate_name: z.string().optional(),    // Optional for now, will be refined
})
.refine(data => {
  if (data.isPEP === true) {
    return data.jobTitle && data.jobTitle.trim() !== '';
  }
  return true;
}, {
  message: 'Job title is required if you are a PEP or related to one.',
  path: ['jobTitle'],
})
.refine(data => {
  if (data.is_close_associate === 'yes') {
    return data.relationship_type && data.relationship_type.trim() !== '';
  }
  return true;
}, {
  message: 'Relationship to PEP is required if you are an associate.',
  path: ['relationship_type'],
})
.refine(data => {
  if (data.is_close_associate === 'yes') {
    return data.associate_name && data.associate_name.trim() !== '';
  }
  return true;
}, {
  message: 'Name of Associated PEP is required if you are an associate.',
  path: ['associate_name'],
});

// Example of how to handle at least one selection if PEP is true (optional)
// .refine(data => {
//   if (data.isPEP === true) {
//     return data.domestic_foreign_roles.length > 0 || 
//            data.immediate_family_members.length > 0 || 
//            data.international_roles.length > 0;
//   }
//   return true;
// }, {
//   message: 'At least one role or relationship must be selected if you are a PEP.',
//   path: ['domestic_foreign_roles'], // Or a general path
// }); 