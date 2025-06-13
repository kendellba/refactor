import type { OptionArray, Gender, MaritalStatus } from '../../../types';

export const GENDER_OPTIONS: OptionArray = [
  { title: 'Male', value: 'Male' },
  { title: 'Female', value: 'Female' },
] as const;

export const ADULT_MARITAL_STATUS_OPTIONS: OptionArray = [
  { title: 'Single', value: 'Single' },
  { title: 'Married', value: 'Married' },
  { title: 'Common-Law', value: 'Common-Law' },
  { title: 'Divorced', value: 'Divorced' },
  { title: 'Widowed', value: 'Widowed' },
] as const;

export const MINOR_MARITAL_STATUS_OPTIONS: OptionArray = [
  { title: 'Single', value: 'Single' },
] as const; 