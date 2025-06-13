import type { OptionArray } from '../../../types';

export const pepPositions: OptionArray = [
  { title: 'Head of State', value: 'head_of_state' },
  { title: 'Senior Politician', value: 'senior_politician' },
  { title: 'Senior Government Official', value: 'senior_government_official' },
  { title: 'Senior Judicial Official', value: 'senior_judicial_official' },
  { title: 'Senior Military Official', value: 'senior_military_official' },
  { title: 'Senior Executive of State-Owned Corporation', value: 'senior_executive_soc' },
  { title: 'High-Ranking Political Party Official', value: 'high_ranking_party_official' },
  { title: 'Other', value: 'other' },
] as const;

export const pepRelationships: OptionArray = [
  { title: 'Self', value: 'self' },
  { title: 'Spouse', value: 'spouse' },
  { title: 'Child', value: 'child' },
  { title: 'Parent', value: 'parent' },
  { title: 'Sibling', value: 'sibling' },
  { title: 'Close Associate', value: 'close_associate' },
] as const;

export const internationalOrganizations: OptionArray = [
  { title: 'InterAmerican Development Bank', value: 'iadb' },
  { title: 'Caribbean Financial Action Task Force', value: 'cfatf' },
  { title: 'Organization of American States', value: 'oas' },
  { title: 'International Labour Organization', value: 'ilo' },
  { title: 'Military Official', value: 'military_official' },
  { title: 'Senior Member of the Legislature', value: 'senior_legislature' },
  { title: 'Other', value: 'other' },
] as const; 