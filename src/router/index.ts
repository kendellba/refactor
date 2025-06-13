import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import ForgotPassword from '@/features/auth/components/ForgotPassword.vue';
import BasicInfo from '@/features/onboarding/components/BasicInfo.vue';
import Address from '@/features/onboarding/components/Address.vue';
import NewOrExistingCustomer from '@/features/onboarding/components/NewOrExistingCustomer.vue';
import GettingReady from '@/features/onboarding/components/GettingReady.vue';
import EmailVerification from '@/features/onboarding/components/EmailVerification.vue';
import IDInformation from '@/features/onboarding/components/IDInformation.vue';
import ChildIDInformation from '@/features/onboarding/components/ChildIDInformation.vue';
import MobileVerification from '@/features/onboarding/components/MobileVerification.vue';
import MembershipDeclarationAgreement from '@/features/onboarding/components/MembershipDeclarationAgreement.vue';
import DueDiligence from '@/features/onboarding/components/DueDiligence.vue';
import MailingAddress from '@/features/onboarding/components/MailingAddress.vue';
import ForeignNationalBankInformation from '@/features/onboarding/components/ForeignNationalBankInformation.vue';
import EmploymentInformation from '@/features/onboarding/components/EmploymentInformation.vue';
import PoliticallyExposedPersons from '@/features/onboarding/components/PoliticallyExposedPersons.vue';
import DesignationOfBeneficiary from '@/features/onboarding/components/DesignationOfBeneficiary.vue';
import PowerofAttorney from '@/features/onboarding/components/PowerofAttorney.vue';
import Branch from '@/features/onboarding/components/Branch.vue';
import Success from '@/features/onboarding/components/Success.vue';
import ParentGuardianInformation from '@/features/onboarding/components/ParentGuardianInformation.vue';
import AccountNumber from '@/features/onboarding/components/AccountNumber.vue';
import EmailVerSuccessful from '@/features/onboarding/components/EmailVerSuccessful.vue';
import MobileVerSuccessful from '@/features/onboarding/components/MobileVerSuccessful.vue';
import ChangePassword from '@/features/auth/components/ChangePassword.vue';
import { useAuthStore } from '@/store/authStore';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: () => import('@/features/auth/components/Login.vue') },
  { path: '/basic-info', name: 'BasicInfo', component: BasicInfo },
  { path: '/address', name: 'Address', component: Address },
  {
    path: '/new-or-existing-customer',
    name: 'NewOrExistingCustomer',
    component: NewOrExistingCustomer,
  },
  { path: '/getting-ready', name: 'GettingReady', component: GettingReady },
  { path: '/email-verification', name: 'EmailVerification', component: EmailVerification },
  { path: '/id-information', name: 'IdInformation', component: IDInformation },
  { path: '/child-id-information', name: 'ChildIdInformation', component: ChildIDInformation },
  { path: '/mobile-verification', name: 'MobileVerification', component: MobileVerification },
  {
    path: '/membership-declaration-agreement',
    name: 'MembershipDeclarationAgreement',
    component: MembershipDeclarationAgreement,
  },
  { path: '/due-diligence', name: 'DueDiligence', component: DueDiligence },
  { path: '/mailing-address', name: 'MailingAddress', component: MailingAddress },
  {
    path: '/foreign-national-bank-information',
    name: 'ForeignNationalBankInformation',
    component: ForeignNationalBankInformation,
  },
  {
    path: '/employment-information',
    name: 'EmploymentInformation',
    component: EmploymentInformation,
  },
  {
    path: '/politically-exposed-persons',
    name: 'PoliticallyExposedPersons',
    component: PoliticallyExposedPersons,
  },
  {
    path: '/designation-of-beneficiary',
    name: 'DesignationOfBeneficiary',
    component: DesignationOfBeneficiary,
  },
  { path: '/power-of-attorney', name: 'PowerofAttorney', component: PowerofAttorney },
  { path: '/branch', name: 'Branch', component: Branch },
  { path: '/success', name: 'Success', component: Success },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword },
  {
    path: '/parent-guardian-information',
    name: 'ParentGuardianInformation',
    component: ParentGuardianInformation,
  },
  { path: '/account-number', name: 'AccountNumber', component: AccountNumber },
  {
    path: '/email-verification-successful',
    name: 'EmailVerSuccessful',
    component: EmailVerSuccessful,
  },
  {
    path: '/mobile-verification-successful',
    name: 'MobileVerSuccessful',
    component: MobileVerSuccessful,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/shared/components/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth state if not already done
  if (!authStore.isInitialized) {
    authStore.initAuth();
    authStore.isInitialized = true;
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
