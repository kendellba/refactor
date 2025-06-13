import { countries } from 'countries-list';

// Updated countryList to be an array of objects { name, code }
export const countryList = Object.keys(countries).map((code) => ({
  name: countries[code].name,
  code: code,
}));

// New export for Zod validation - an array of country codes
export const COUNTRY_CODES_FOR_VALIDATION = countryList.map(country => country.code);

// Kept for backwards compatibility for now, but beneficiary schema should use COUNTRY_CODES_FOR_VALIDATION
export const COUNTRY_LIST_FOR_VALIDATION = countryList;

export const dwellingStatusOptions = ['Rented', 'Owned', 'Subletting', 'Living with family'];

export const utilityBillTypeOptions = [
  'Cable Bill',
  'Electricity Bill',
  'Water Bill',
  'Landline Phone Bill',
  'Authorization Letter from Owner',
  'Deed',
]; 