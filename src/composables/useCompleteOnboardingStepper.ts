import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Define the complete onboarding flow steps
export const COMPLETE_ONBOARDING_STEPS = [
  {
    route: '/basic-info',
    title: 'Basic Information',
    subtitle: 'Personal details',
    icon: 'mdi-account',
    category: 'personal'
  },
  {
    route: '/email-verification',
    title: 'Email Verification',
    subtitle: 'Verify your email',
    icon: 'mdi-email-check',
    category: 'verification'
  },
  {
    route: '/mobile-verification',
    title: 'Mobile Verification',
    subtitle: 'Verify your phone',
    icon: 'mdi-phone-check',
    category: 'verification'
  },
  {
    route: '/membership-declaration-agreement',
    title: 'Membership Agreement',
    subtitle: 'Terms and agreements',
    icon: 'mdi-file-document-check',
    category: 'legal'
  },
  {
    route: '/politically-exposed-persons',
    title: 'PEP Information',
    subtitle: 'Political exposure',
    icon: 'mdi-shield-account',
    category: 'compliance'
  },
  {
    route: '/child-id-information',
    title: 'Child ID Information',
    subtitle: 'Child identification',
    icon: 'mdi-account-child',
    category: 'identification'
  },
  {
    route: '/parent-guardian-information',
    title: 'Parent/Guardian Info',
    subtitle: 'Guardian details',
    icon: 'mdi-account-supervisor',
    category: 'identification'
  },
  {
    route: '/id-information',
    title: 'ID Information',
    subtitle: 'Identification details',
    icon: 'mdi-card-account-details',
    category: 'identification'
  },
  {
    route: '/address',
    title: 'Address',
    subtitle: 'Residential address',
    icon: 'mdi-home',
    category: 'personal'
  },
  {
    route: '/mailing-address',
    title: 'Mailing Address',
    subtitle: 'Postal address',
    icon: 'mdi-email-outline',
    category: 'personal'
  },
  {
    route: '/due-diligence',
    title: 'Due Diligence',
    subtitle: 'Compliance check',
    icon: 'mdi-shield-check',
    category: 'compliance'
  },
  {
    route: '/foreign-national-bank-information',
    title: 'Foreign Bank Info',
    subtitle: 'International banking',
    icon: 'mdi-bank',
    category: 'banking'
  },
  {
    route: '/employment-information',
    title: 'Employment',
    subtitle: 'Work information',
    icon: 'mdi-briefcase',
    category: 'personal'
  },
  {
    route: '/designation-of-beneficiary',
    title: 'Beneficiaries',
    subtitle: 'Designate beneficiaries',
    icon: 'mdi-account-group',
    category: 'account'
  },
  {
    route: '/power-of-attorney',
    title: 'Power of Attorney',
    subtitle: 'Legal representation',
    icon: 'mdi-gavel',
    category: 'legal'
  },
  {
    route: '/branch',
    title: 'Branch Selection',
    subtitle: 'Choose your branch',
    icon: 'mdi-office-building',
    category: 'account'
  },
  {
    route: '/success',
    title: 'Complete',
    subtitle: 'Application submitted',
    icon: 'mdi-check-circle',
    category: 'completion'
  }
];

export function useCompleteOnboardingStepper() {
  const router = useRouter();
  const route = useRoute();

  // State for tracking completed steps
  const completedSteps = ref([]);
  const skippedSteps = ref([]);

  // Computed properties
  const currentStepIndex = computed(() => {
    const stepIndex = COMPLETE_ONBOARDING_STEPS.findIndex(step => step.route === route.path);
    return stepIndex >= 0 ? stepIndex : 0;
  });

  const currentStep = computed(() => {
    return COMPLETE_ONBOARDING_STEPS[currentStepIndex.value];
  });

  const currentStepNumber = computed(() => {
    return currentStepIndex.value + 1;
  });

  const progress = computed(() => {
    return Math.round((completedSteps.value.length / COMPLETE_ONBOARDING_STEPS.length) * 100);
  });

  const isFirstStep = computed(() => {
    return currentStepIndex.value === 0;
  });

  const isLastStep = computed(() => {
    return currentStepIndex.value === COMPLETE_ONBOARDING_STEPS.length - 1;
  });

  const nextStep = computed(() => {
    const nextIndex = currentStepIndex.value + 1;
    return nextIndex < COMPLETE_ONBOARDING_STEPS.length ? COMPLETE_ONBOARDING_STEPS[nextIndex] : null;
  });

  const previousStep = computed(() => {
    const prevIndex = currentStepIndex.value - 1;
    return prevIndex >= 0 ? COMPLETE_ONBOARDING_STEPS[prevIndex] : null;
  });

  // Actions
  const markStepComplete = (stepRoute = null) => {
    const routeToMark = stepRoute || route.path;
    if (!completedSteps.value.includes(routeToMark)) {
      completedSteps.value.push(routeToMark);
      saveToStorage();
    }
  };

  const markStepSkipped = (stepRoute = null) => {
    const routeToMark = stepRoute || route.path;
    if (!skippedSteps.value.includes(routeToMark)) {
      skippedSteps.value.push(routeToMark);
      saveToStorage();
    }
  };

  const isStepComplete = (stepRoute) => {
    return completedSteps.value.includes(stepRoute);
  };

  const isStepSkipped = (stepRoute) => {
    return skippedSteps.value.includes(stepRoute);
  };

  const isStepAccessible = (stepIndex) => {
    // Current step is always accessible
    if (stepIndex === currentStepIndex.value) return true;
    
    // Previous steps are always accessible
    if (stepIndex < currentStepIndex.value) return true;
    
    // Next steps are accessible if all previous steps are complete or skipped
    for (let i = 0; i < stepIndex; i++) {
      const step = COMPLETE_ONBOARDING_STEPS[i];
      if (!isStepComplete(step.route) && !isStepSkipped(step.route)) {
        return false;
      }
    }
    
    return true;
  };

  const navigateToStep = (stepRoute) => {
    const step = COMPLETE_ONBOARDING_STEPS.find(s => s.route === stepRoute);
    if (!step) return false;
    
    router.push(stepRoute);
    return true;
  };

  const navigateNext = () => {
    if (nextStep.value) {
      router.push(nextStep.value.route);
      return true;
    }
    return false;
  };

  const navigatePrevious = () => {
    if (previousStep.value) {
      router.push(previousStep.value.route);
      return true;
    }
    return false;
  };

  // Persistence helpers
  const saveToStorage = () => {
    const state = {
      completedSteps: completedSteps.value,
      skippedSteps: skippedSteps.value,
      timestamp: Date.now()
    };
    localStorage.setItem('complete-onboarding-progress', JSON.stringify(state));
  };

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('complete-onboarding-progress');
      if (stored) {
        const state = JSON.parse(stored);
        completedSteps.value = state.completedSteps || [];
        skippedSteps.value = state.skippedSteps || [];
      }
    } catch (error) {
      console.error('Error loading complete onboarding progress:', error);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('complete-onboarding-progress');
    completedSteps.value = [];
    skippedSteps.value = [];
  };

  // Initialize
  loadFromStorage();

  return {
    // State
    completedSteps,
    skippedSteps,
    
    // Computed
    currentStepIndex,
    currentStep,
    currentStepNumber,
    progress,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    
    // Actions
    markStepComplete,
    markStepSkipped,
    isStepComplete,
    isStepSkipped,
    isStepAccessible,
    navigateToStep,
    navigateNext,
    navigatePrevious,
    
    // Storage
    saveToStorage,
    loadFromStorage,
    clearStorage,
    
    // Constants
    COMPLETE_ONBOARDING_STEPS
  };
} 