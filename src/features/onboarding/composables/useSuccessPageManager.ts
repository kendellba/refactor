import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useAuthStore } from '@/store/authStore';
import { useDemoStore } from '@/store/demoStore';

export function useSuccessPageManager() {
  const router = useRouter();
  const onboardingStore = useOnboardingStore();
  const authStore = useAuthStore();
  const demoStore = useDemoStore();

  const isRetrying = ref(false);
  const accountCreated = ref(false);

  const statusMessage = computed(() => {
    if (onboardingStore.isLoading) return 'Waiting...';
    if (accountCreated.value) return 'Account created successfully!';
    return 'Something went wrong';
  });

  const subMessage = computed(() => {
    if (onboardingStore.isLoading) return 'Please wait while we create your account...';
    if (accountCreated.value) {
      return 'Your account is pending approval. We will send you an email when your signup has been successfully approved.';
    }
    return 'Please try again or contact support if a problem occurs.';
  });

  const isAdmin = computed(() => authStore.userRole === 'admin');

  const createAccount = async () => {
    onboardingStore.apiSubmitError = null;
    const result = await onboardingStore.finalizeOnboarding();

    if (result.success) {
      accountCreated.value = true;
    }
  };

  const retry = async () => {
    isRetrying.value = true;
    await createAccount();
    isRetrying.value = false;
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToApprovals = () => {
    router.push('/admin/approvals');
  };

  // Timer reference for cleanup
  const countdownTimer = ref(null);

  onMounted(() => {
    // Check if essential data is missing for account creation
    if (!demoStore.signupId) {
        onboardingStore.apiSubmitError = 'Signup information not found. Please start the registration process again.';
        return;
    }
    createAccount();
  });

  onBeforeUnmount(() => {
    if (countdownTimer.value) {
      clearInterval(countdownTimer.value);
    }
  });

  return {
    isLoading: computed(() => onboardingStore.isLoading),
    apiSubmitError: computed(() => onboardingStore.apiSubmitError),
    isRetrying,
    accountCreated,
    statusMessage,
    subMessage,
    isAdmin,
    retry,
    navigateToLogin,
    navigateToApprovals,
  };
} 