import type { OptionArray, LabelValueOptionArray } from '../../../types';

export const BRANCH_OPTIONS: OptionArray = [
  { title: 'Port of Spain', value: 'Port of Spain' },
  { title: 'Milford Rd, Tobago', value: 'Milford Rd, Tobago' },
] as const;

export const PREFERRED_CONTACT_METHOD_OPTIONS: LabelValueOptionArray = [
  { label: 'Phone', value: 'phone' },
  { label: 'Email', value: 'email' },
] as const;

export const BEST_CONTACT_TIME_OPTIONS: LabelValueOptionArray = [
  { label: '8:00am to 12:00pm', value: '8:00am to 12:00pm' },
  { label: '12:00pm to 4:00pm', value: '12:00pm to 4:00pm' },
  { label: 'Anytime 8:00am to 4:00pm', value: 'Anytime 8:00am to 4:00pm' },
] as const; 