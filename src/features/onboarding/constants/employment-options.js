export const OCCUPATIONS = [
  'Accountant',
  'Administrative Assistant',
  'Architect',
  'Artist',
  'Attorney',
  'Banker',
  'Business Owner',
  'Chef',
  'Computer Programmer',
  'Consultant',
  'Customer Service Representative',
  'Doctor',
  'Educator',
  'Engineer',
  'Executive',
  'Financial Analyst',
  'Graphic Designer',
  'Healthcare Professional',
  'Human Resources',
  'IT Professional',
  'Journalist',
  'Manager',
  'Marketing Professional',
  'Nurse',
  'Office Worker',
  'Pharmacist',
  'Police Officer',
  'Project Manager',
  'Real Estate Agent',
  'Retired',
  'Sales Representative',
  'Self-Employed',
  'Social Worker',
  'Student',
  'Technician',
  'Unemployed',
  'Writer',
  'Other',
];

export const BUSINESS_TYPES = [
  'Retail',
  'Food Service',
  'Manufacturing',
  'Construction',
  'Technology',
  'Healthcare',
  'Financial Services',
  'Real Estate',
  'Education',
  'Transportation',
  'Agriculture',
  'Entertainment',
  'Consulting',
  'Legal Services',
  'Hospitality',
  'Other',
];

export const EMPLOYMENT_STATUS_OPTIONS_RAW = ['employed', 'self-employed', 'unemployed', 'student', 'retired'];

export const DISPLAY_EMPLOYMENT_STATUS_OPTIONS = EMPLOYMENT_STATUS_OPTIONS_RAW.map((option) => ({
  title: option
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
  value: option,
}));

export const MONTHLY_REMUNERATION_OPTIONS = [
  'Under $5,000',
  '$5,001 - $10,000',
  '$10,001 - $15,000',
  '$15,001 - $20,000',
  '$20,001 - $25,000',
  '$25,001 - $30,000',
  '$30,001 - $35,000',
  '$35,001 - $40,000',
  '$40,001 - $45,000',
  '$45,001 - $50,000',
  'Over $50,000',
];

export const VALUE_OF_ASSETS_OPTIONS = [
  'Under $100,000',
  '$100,001 - $250,000',
  '$250,001 - $350,000',
  '$350,001 - $500,000',
  'Over $500,000',
];

export const CHILD_CONTRIBUTION_OPTIONS = [
  'Monthly',
  'Quarterly',
  'Annually',
  'One-time deposit',
  'Irregular contributions',
];

export const SOURCE_OF_FUNDS_OPTIONS = ['Job Letter', 'Payslip', 'Bank Statement', 'Income Statement'];

export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; 