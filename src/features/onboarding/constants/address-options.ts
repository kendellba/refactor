import { countries } from 'countries-list';
import type { StringArray } from '../../../types';

// Define the shape of the country object from countries-list
interface CountryData {
  name: string;
  code: string;
}

// Updated countryList to be an array of objects { name, code }
export const countryList: CountryData[] = Object.keys(countries).map((code) => ({
  name: countries[code].name,
  code: code,
}));

// New export for Zod validation - an array of country codes
export const COUNTRY_CODES_FOR_VALIDATION: string[] = countryList.map(country => country.code);

// Kept for backwards compatibility for now, but beneficiary schema should use COUNTRY_CODES_FOR_VALIDATION
export const COUNTRY_LIST_FOR_VALIDATION: CountryData[] = countryList;

export const dwellingStatusOptions: StringArray = ['Rented', 'Owned', 'Subletting', 'Living with family'] as const;

export const utilityBillTypeOptions: StringArray = [
  'Cable Bill',
  'Electricity Bill',
  'Water Bill',
  'Landline Phone Bill',
  'Authorization Letter from Owner',
  'Deed',
] as const; 