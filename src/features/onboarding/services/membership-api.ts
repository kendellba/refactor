import { api } from '@/shared/services/api';

const BASE_URL = '/membership-declarations';

export const MembershipApiService = {
  submitMembershipDeclaration: (membershipData) => {
    return api.post(`${BASE_URL}/`, membershipData);
  },
}; 