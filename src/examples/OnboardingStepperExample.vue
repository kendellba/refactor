<template>
  <div class="onboarding-example">
    <v-container>
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-h4 font-weight-bold mb-2">Account Opening Process</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Complete the following steps to open your account
        </p>
      </div>

      <!-- Stepper -->
      <SimpleStepper
        :steps="onboardingSteps"
        :completed-steps="completedSteps"
        :initial-step="getCurrentStepNumber()"
        :allow-step-navigation="true"
        @step-change="handleStepChange"
        @step-click="handleStepClick"
      />

      <!-- Content Area -->
      <v-card class="mt-6" elevation="2">
        <v-card-text class="pa-6">
          <router-view @step-complete="markStepComplete" />
        </v-card-text>
      </v-card>

      <!-- Debug Info (Remove in production) -->
      <v-card v-if="showDebugInfo" class="mt-4" variant="outlined">
        <v-card-title class="text-subtitle-1">Debug Info</v-card-title>
        <v-card-text>
          <div><strong>Current Route:</strong> {{ $route.path }}</div>
          <div><strong>Current Step:</strong> {{ getCurrentStepNumber() }}</div>
          <div><strong>Completed Steps:</strong> {{ completedSteps.join(', ') }}</div>
          <div><strong>Progress:</strong> {{ Math.round((completedSteps.length / onboardingSteps.length) * 100) }}%</div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import type { StepItem } from '@/types';

const route = useRoute();
const router = useRouter();

// Define your onboarding steps
const onboardingSteps: StepItem[] = [
  {
    title: 'Customer Type',
    subtitle: 'New or existing customer',
    icon: 'mdi-account-question',
    route: '/new-or-existing-customer'
  },
  {
    title: 'Getting Ready',
    subtitle: 'Preparation information',
    icon: 'mdi-information',
    route: '/getting-ready'
  },
  {
    title: 'Basic Information',
    subtitle: 'Personal details',
    icon: 'mdi-account',
    route: '/basic-info'
  },
  {
    title: 'Email Verification',
    subtitle: 'Verify your email',
    icon: 'mdi-email-check',
    route: '/email-verification'
  },
  {
    title: 'Mobile Verification',
    subtitle: 'Verify your phone',
    icon: 'mdi-phone-check',
    route: '/mobile-verification'
  },
  {
    title: 'Account Number',
    subtitle: 'Enter account number',
    icon: 'mdi-pound',
    route: '/account-number'
  },
  {
    title: 'Due Diligence',
    subtitle: 'Compliance information',
    icon: 'mdi-shield-check',
    route: '/due-diligence'
  },
  {
    title: 'Address',
    subtitle: 'Residential address',
    icon: 'mdi-map-marker',
    route: '/address'
  },
  {
    title: 'Mailing Address',
    subtitle: 'Mailing information',
    icon: 'mdi-email',
    route: '/mailing-address'
  },
  {
    title: 'ID Information',
    subtitle: 'Identification documents',
    icon: 'mdi-card-account-details',
    route: '/id-info'
  },
  {
    title: 'Employment',
    subtitle: 'Work information',
    icon: 'mdi-briefcase',
    route: '/employment'
  },
  {
    title: 'PEP Information',
    subtitle: 'Political exposure',
    icon: 'mdi-shield-account',
    route: '/politically-exposed-persons'
  },
  {
    title: 'Beneficiaries',
    subtitle: 'Designate beneficiaries',
    icon: 'mdi-account-group',
    route: '/designation-of-beneficiary'
  },
  {
    title: 'Power of Attorney',
    subtitle: 'Legal representation',
    icon: 'mdi-gavel',
    route: '/power-of-attorney'
  },
  {
    title: 'Membership Agreement',
    subtitle: 'Terms and agreements',
    icon: 'mdi-file-document-check',
    route: '/membership-declaration-agreement'
  },
  {
    title: 'Branch Selection',
    subtitle: 'Choose your branch',
    icon: 'mdi-office-building',
    route: '/branch'
  },
  {
    title: 'Complete',
    subtitle: 'Application submitted',
    icon: 'mdi-check-circle',
    route: '/success'
  }
];

// Track completed steps
const completedSteps = ref([]);

// Show debug info (toggle for development)
const showDebugInfo = ref(true);

// Computed properties
const getCurrentStepNumber = () => {
  const currentRoute = route.path;
  const stepIndex = onboardingSteps.findIndex(step => step.route === currentRoute);
  return stepIndex >= 0 ? stepIndex + 1 : 1;
};

// Methods
const handleStepChange = ({ stepIndex, step, currentStep }) => {
  console.log('Step changed:', { stepIndex, step, currentStep });
};

const handleStepClick = ({ stepIndex, step }) => {
  console.log('Step clicked:', { stepIndex, step });
  
  // Navigate to the step if it has a route
  if (step.route && step.route !== route.path) {
    router.push(step.route);
  }
};

const markStepComplete = (stepRoute = null) => {
  const routeToMark = stepRoute || route.path;
  
  if (!completedSteps.value.includes(routeToMark)) {
    completedSteps.value.push(routeToMark);
    console.log('Step completed:', routeToMark);
    
    // Save to localStorage for persistence
    saveProgress();
  }
};

const saveProgress = () => {
  try {
    localStorage.setItem('onboarding-progress', JSON.stringify({
      completedSteps: completedSteps.value,
      lastStep: route.path,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

const loadProgress = () => {
  try {
    const saved = localStorage.getItem('onboarding-progress');
    if (saved) {
      const data = JSON.parse(saved);
      completedSteps.value = data.completedSteps || [];
      console.log('Progress loaded:', data);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
};

// Lifecycle
onMounted(() => {
  loadProgress();
  
  // You can also integrate with your existing stores
  // const demoStore = useDemoStore();
  // if (demoStore.completedSteps) {
  //   completedSteps.value = demoStore.completedSteps;
  // }
});
</script>

<style scoped>
.onboarding-example {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 2rem 0;
}

:deep(.v-stepper) {
  background: transparent;
}

:deep(.v-stepper-header) {
  box-shadow: none;
  background: white;
  border-radius: 12px;
  padding: 1rem;
}

:deep(.v-stepper-item) {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 0.5rem;
}

:deep(.v-stepper-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

@media (max-width: 960px) {
  .onboarding-example {
    padding: 1rem 0;
  }
}
</style> 