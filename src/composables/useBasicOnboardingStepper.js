import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Define the specific onboarding steps requested
export const BASIC_ONBOARDING_STEPS = [
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
  }
];

export function useBasicOnboardingStepper() {
  const router = useRouter();
  const route = useRoute();

  // State for tracking completed steps
  const completedSteps = ref([]);
  const skippedSteps = ref([]);

  // Computed properties
  const currentStepIndex = computed(() => {
    const stepIndex = BASIC_ONBOARDING_STEPS.findIndex(step => step.route === route.path);
    return stepIndex >= 0 ? stepIndex : 0;
  });

  const currentStep = computed(() => {
    return BASIC_ONBOARDING_STEPS[currentStepIndex.value];
  });

  const currentStepNumber = computed(() => {
    return currentStepIndex.value + 1;
  });

  const progress = computed(() => {
    return Math.round((completedSteps.value.length / BASIC_ONBOARDING_STEPS.length) * 100);
  });

  const isFirstStep = computed(() => {
    return currentStepIndex.value === 0;
  });

  const isLastStep = computed(() => {
    return currentStepIndex.value === BASIC_ONBOARDING_STEPS.length - 1;
  });

  const nextStep = computed(() => {
    const nextIndex = currentStepIndex.value + 1;
    return nextIndex < BASIC_ONBOARDING_STEPS.length ? BASIC_ONBOARDING_STEPS[nextIndex] : null;
  });

  const previousStep = computed(() => {
    const prevIndex = currentStepIndex.value - 1;
    return prevIndex >= 0 ? BASIC_ONBOARDING_STEPS[prevIndex] : null;
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
      const step = BASIC_ONBOARDING_STEPS[i];
      if (!isStepComplete(step.route) && !isStepSkipped(step.route)) {
        return false;
      }
    }
    
    return true;
  };

  const navigateToStep = (stepRoute) => {
    const step = BASIC_ONBOARDING_STEPS.find(s => s.route === stepRoute);
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
    localStorage.setItem('basic-onboarding-progress', JSON.stringify(state));
  };

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('basic-onboarding-progress');
      if (stored) {
        const state = JSON.parse(stored);
        completedSteps.value = state.completedSteps || [];
        skippedSteps.value = state.skippedSteps || [];
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('basic-onboarding-progress');
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
    
    // Methods
    markStepComplete,
    markStepSkipped,
    isStepComplete,
    isStepSkipped,
    isStepAccessible,
    navigateToStep,
    navigateNext,
    navigatePrevious,
    
    // Persistence
    saveToStorage,
    loadFromStorage,
    clearStorage,
    
    // Constants
    BASIC_ONBOARDING_STEPS
  };
} 