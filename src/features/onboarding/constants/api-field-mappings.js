export const API_FIELD_MAPPINGS = {
  MEMBERSHIP_DECLARATION: {
    is_member_of_another_credit_union: 'isMemberOfAnotherCreditUnion',
    credit_union_name: 'creditUnionName',
    is_serving_on_credit_union_board: 'isServingOnBoard',
    board_credit_union_name: 'creditUnionBoardName',
  },

  PEP: {
    is_pep: 'isPEP',
    job_title: 'jobTitle',
    domestic_foreign_roles: 'domestic_foreign_roles',
    international_roles: 'international_roles',
    immediate_family_members: 'immediate_family_members',
    is_close_associate: 'is_close_associate',
    relationship_type: 'relationship_type',
    associate_name: 'associate_name',
  },

  POWER_OF_ATTORNEY: {
    first_name: 'first_name',
    last_name: 'last_name',
    middle_name: 'middle_name',
    address_line_1: 'address_line_1',
    address_line_2: 'address_line_2',
    city: 'city',
    country: 'country',
    dob: 'dob',
    gender: 'gender',
    relationship_to_principal: 'relationship_to_principal',
    email: 'email',
    phone: 'phone',
    id_number: 'id_number',
    id_type: 'id_type',
    power_of_attorney_files: 'power_of_attorney_document',
    id_document: 'id_document',
    power_of_attorney_document: 'power_of_attorney_document',
  },

  EMPLOYMENT: {
    employment_status: 'employmentStatus',
    occupation: 'occupation',
    employer_name: 'employerName',
    business_type: 'businessType',
    // Add other employment field mappings
  },

  BENEFICIARY: {
    first_name: 'firstName',
    last_name: 'lastName',
    middle_name: 'middleName',
    address_line_1: 'addressLine1',
    address_line_2: 'addressLine2',
    city: 'city',
    country: 'country',
    dob: 'dob',
    gender: 'gender',
    relationship_to_beneficiary: 'relationshipToBeneficiary',
    id_number: 'idNumber',
    id_type: 'idType',
    percent_of_beneficiary_interest: 'percentOfBeneficiaryInterest',
  },
}; 