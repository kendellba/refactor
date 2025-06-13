import type { OptionArray } from '../../../types';

export const ID_TYPES: OptionArray = [
  { title: 'Birth Certificate', value: 'Birth Certificate' },
  { title: 'Passport', value: 'Passport' },
  { title: 'National ID', value: 'National ID' },
  { title: "Driver's License", value: "Driver's License" },
] as const;

// Default expiry for Birth Certificate, can be used in schema or component logic
export const DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE = '9999-12-31' as const; 