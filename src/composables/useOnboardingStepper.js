import { ref, computed, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Define the complete onboarding flow steps
export const ONBOARDING_STEPS = [
  {
    route: '/new-or-existing-customer',
    title: 'Customer Type',
    subtitle: 'New or existing customer',
    icon: 'mdi-account-question',
    category: 'setup'
  },
  {
    route: '/getting-ready',
    title: 'Getting Ready',
    subtitle: 'Preparation information',
    icon: 'mdi-information',
    category: 'setup'
  },
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
    route: '/account-number',
    title: 'Account Number',
    subtitle: 'Enter account number',
    icon: 'mdi-pound',
    category: 'account'
  },
  {
    route: '/due-diligence',
    title: 'Due Diligence',
    subtitle: 'Compliance information',
    icon: 'mdi-shield-check',
    category: 'compliance'
  },
  {
    route: '/address',
    title: 'Address',
    subtitle: 'Residential address',
    icon: 'mdi-map-marker',
    category: 'personal'
  },
  {
    route: '/mailing-address',
    title: 'Mailing Address',
    subtitle: 'Mailing information',
    icon: 'mdi-email',
    category: 'personal'
  },
  {
    route: '/id-information',
    title: 'ID Information',
    subtitle: 'Identification documents',
    icon: 'mdi-card-account-details',
    category: 'documents'
  },
  {
    route: '/child-id-information',
    title: 'Child ID Information',
    subtitle: 'Child identification',
    icon: 'mdi-account-child',
    category: 'documents',
    conditional: true // Only for minor accounts
  },
  {
    route: '/parent-guardian-information',
    title: 'Parent/Guardian',
    subtitle: 'Guardian information',
    icon: 'mdi-account-supervisor',
    category: 'personal',
    conditional: true // Only for minor accounts
  },
  {
    route: '/employment-information',
    title: 'Employment',
    subtitle: 'Work information',
    icon: 'mdi-briefcase',
    category: 'personal'
  },
  {
    route: '/foreign-national-bank-information',
    title: 'Foreign Bank Info',
    subtitle: 'International banking',
    icon: 'mdi-bank',
    category: 'banking',
    conditional: true // Only for foreign nationals
  },
  {
    route: '/politically-exposed-persons',
    title: 'PEP Information',
    subtitle: 'Political exposure',
    icon: 'mdi-shield-account',
    category: 'compliance'
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
    route: '/membership-declaration-agreement',
    title: 'Membership Agreement',
    subtitle: 'Terms and agreements',
    icon: 'mdi-file-document-check',
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

export function useOnboardingStepper() {
  const router = useRouter();
  const route = useRoute();

  // State for tracking completed steps
  const completedSteps = ref([]);
  const skippedSteps = ref([]);
  const currentStepData = reactive({});

  // Computed properties
  const currentStepIndex = computed(() => {
    const stepIndex = ONBOARDING_STEPS.findIndex(step => step.route === route.path);
    return stepIndex >= 0 ? stepIndex : 0;
  });

  const currentStep = computed(() => {
    return ONBOARDING_STEPS[currentStepIndex.value];
  });

  const progress = computed(() => {
    return Math.round((completedSteps.value.length / ONBOARDING_STEPS.length) * 100);
  });

  const isFirstStep = computed(() => {
    return currentStepIndex.value === 0;
  });

  const isLastStep = computed(() => {
    return currentStepIndex.value === ONBOARDING_STEPS.length - 1;
  });

  const nextStep = computed(() => {
    const nextIndex = currentStepIndex.value + 1;
    return nextIndex < ONBOARDING_STEPS.length ? ONBOARDING_STEPS[nextIndex] : null;
  });

  const previousStep = computed(() => {
    const prevIndex = currentStepIndex.value - 1;
    return prevIndex >= 0 ? ONBOARDING_STEPS[prevIndex] : null;
  });

  // Filter steps based on conditions
  const getVisibleSteps = (userProfile = {}) => {
    return ONBOARDING_STEPS.filter(step => {
      if (!step.conditional) return true;
      
      // Handle conditional steps based on user profile
      if (step.route === '/child-id-information' || step.route === '/parent-guardian-information') {
        return userProfile.isMinor === true;
      }
      
      if (step.route === '/foreign-national-bank-information') {
        return userProfile.hasForeignBankAccount === true;
      }
      
      return true;
    });
  };

  // Actions
  const markStepComplete = (stepRoute) => {
    if (!completedSteps.value.includes(stepRoute)) {
      completedSteps.value.push(stepRoute);
    }
    // Remove from skipped steps if it was skipped before
    const skippedIndex = skippedSteps.value.indexOf(stepRoute);
    if (skippedIndex > -1) {
      skippedSteps.value.splice(skippedIndex, 1);
    }
  };

  const markStepSkipped = (stepRoute) => {
    if (!skippedSteps.value.includes(stepRoute)) {
      skippedSteps.value.push(stepRoute);
    }
    // Remove from completed steps if it was completed before
    const completedIndex = completedSteps.value.indexOf(stepRoute);
    if (completedIndex > -1) {
      completedSteps.value.splice(completedIndex, 1);
    }
  };

  const isStepComplete = (stepRoute) => {
    return completedSteps.value.includes(stepRoute);
  };

  const isStepSkipped = (stepRoute) => {
    return skippedSteps.value.includes(stepRoute);
  };

  const isStepAccessible = (stepIndex, userProfile = {}) => {
    const visibleSteps = getVisibleSteps(userProfile);
    const step = visibleSteps[stepIndex];
    
    if (!step) return false;
    
    // Current step is always accessible
    if (stepIndex === currentStepIndex.value) return true;
    
    // Previous steps are always accessible
    if (stepIndex < currentStepIndex.value) return true;
    
    // Next steps are accessible if all previous required steps are complete
    for (let i = 0; i < stepIndex; i++) {
      const prevStep = visibleSteps[i];
      if (!isStepComplete(prevStep.route) && !isStepSkipped(prevStep.route)) {
        return false;
      }
    }
    
    return true;
  };

  const navigateToStep = (stepRoute) => {
    const step = ONBOARDING_STEPS.find(s => s.route === stepRoute);
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

  const resetProgress = () => {
    completedSteps.value = [];
    skippedSteps.value = [];
    Object.keys(currentStepData).forEach(key => {
      delete currentStepData[key];
    });
  };

  // Save step data
  const saveStepData = (stepRoute, data) => {
    currentStepData[stepRoute] = data;
  };

  const getStepData = (stepRoute) => {
    return currentStepData[stepRoute] || {};
  };

  // Persistence helpers (can be enhanced with localStorage)
  const saveToStorage = () => {
    const state = {
      completedSteps: completedSteps.value,
      skippedSteps: skippedSteps.value,
      stepData: currentStepData
    };
    localStorage.setItem('onboarding-progress', JSON.stringify(state));
  };

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('onboarding-progress');
      if (stored) {
        const state = JSON.parse(stored);
        completedSteps.value = state.completedSteps || [];
        skippedSteps.value = state.skippedSteps || [];
        Object.assign(currentStepData, state.stepData || {});
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('onboarding-progress');
    resetProgress();
  };

  // Auto-save on changes
  const setupAutoSave = () => {
    // Save progress whenever completed or skipped steps change
    const saveProgress = () => saveToStorage();
    
    return {
      saveProgress
    };
  };

  return {
    // State
    completedSteps,
    skippedSteps,
    currentStepData,
    
    // Computed
    currentStepIndex,
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    
    // Methods
    getVisibleSteps,
    markStepComplete,
    markStepSkipped,
    isStepComplete,
    isStepSkipped,
    isStepAccessible,
    navigateToStep,
    navigateNext,
    navigatePrevious,
    resetProgress,
    saveStepData,
    getStepData,
    
    // Persistence
    saveToStorage,
    loadFromStorage,
    clearStorage,
    setupAutoSave,
    
    // Constants
    ONBOARDING_STEPS
  };
} 