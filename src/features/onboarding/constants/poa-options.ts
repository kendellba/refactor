import type { StringArray } from '../../../types';

export const relationshipOptions: StringArray = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'Friend',
  'Legal Guardian',
  'Business Partner',
  'Other',
] as const;

export const idTypes: StringArray = [
  'National ID',
  'Passport',
  "Driver's License",
  'Birth Certificate',
] as const; 