<template>
  <div class="onboarding-demo">
    <v-app-bar color="primary" dark elevation="2">
      <v-app-bar-title>Onboarding Stepper Demo</v-app-bar-title>
      <v-spacer />
      <v-btn icon @click="resetProgress">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-h4 font-weight-bold mb-2">Account Opening Process</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Complete the following steps to open your account
          </p>
        </div>

        <!-- Stepper -->
        <SimpleStepper
          :steps="onboardingSteps"
          :completed-steps="completedSteps"
          :initial-step="currentStep"
          :allow-step-navigation="true"
          @step-change="handleStepChange"
          @step-click="handleStepClick"
        />

        <!-- Demo Content -->
        <v-card class="mt-8" elevation="3">
          <v-card-title class="d-flex align-center">
            <v-icon :color="getCurrentStepColor()" class="mr-2">
              {{ getCurrentStepIcon() }}
            </v-icon>
            {{ getCurrentStepTitle() }}
          </v-card-title>
          
          <v-card-text class="pa-6">
            <div class="demo-content">
              <h3 class="text-h6 mb-4">{{ getCurrentStepTitle() }}</h3>
              <p class="text-body-1 mb-4">{{ getCurrentStepDescription() }}</p>
              
              <!-- Simulate form content -->
              <v-form @submit.prevent="completeCurrentStep">
                <v-text-field
                  v-model="formData.sampleField"
                  :label="`Sample field for ${getCurrentStepTitle()}`"
                  variant="outlined"
                  class="mb-4"
                />
                
                <div class="d-flex justify-space-between">
                  <v-btn
                    :disabled="currentStep <= 1"
                    variant="outlined"
                    @click="previousStep"
                  >
                    <v-icon start>mdi-arrow-left</v-icon>
                    Previous
                  </v-btn>
                  
                  <v-btn
                    color="primary"
                    type="submit"
                    :disabled="currentStep >= onboardingSteps.length"
                  >
                    <span v-if="currentStep >= onboardingSteps.length">
                      Complete
                    </span>
                    <span v-else>
                      Complete Step
                    </span>
                    <v-icon end>mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-card-text>
        </v-card>

        <!-- Progress Summary -->
        <v-card class="mt-6" variant="outlined">
          <v-card-title>Progress Summary</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-progress-circular
                :model-value="progressPercentage"
                :color="progressColor"
                size="60"
                width="6"
                class="mr-4"
              >
                {{ Math.round(progressPercentage) }}%
              </v-progress-circular>
              
              <div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ completedSteps.length }} of {{ onboardingSteps.length }} steps completed
                </div>
                <div class="text-caption text-medium-emphasis">
                  Current: Step {{ currentStep }} - {{ getCurrentStepTitle() }}
                </div>
              </div>
            </div>

            <!-- Step List -->
            <v-list density="compact">
              <v-list-item
                v-for="(step, index) in onboardingSteps"
                :key="index"
                :class="getStepClass(index + 1)"
                @click="goToStep(index + 1)"
              >
                <template #prepend>
                  <v-icon :color="getStepStatusColor(index + 1)" size="small">
                    {{ getStepStatusIcon(index + 1) }}
                  </v-icon>
                </template>

                <v-list-item-title class="text-body-2">
                  {{ step.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-caption">
                  {{ step.subtitle }}
                </v-list-item-subtitle>

                <template #append>
                  <v-chip
                    v-if="index + 1 === currentStep"
                    size="x-small"
                    color="primary"
                    variant="flat"
                  >
                    Current
                  </v-chip>
                  <v-chip
                    v-else-if="completedSteps.includes(step.route)"
                    size="x-small"
                    color="success"
                    variant="flat"
                  >
                    Complete
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';

// Demo onboarding steps (subset for demonstration)
const onboardingSteps = ref([
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
    title: 'Address',
    subtitle: 'Residential address',
    icon: 'mdi-map-marker',
    route: '/address'
  },
  {
    title: 'ID Information',
    subtitle: 'Identification documents',
    icon: 'mdi-card-account-details',
    route: '/id-information'
  },
  {
    title: 'Employment',
    subtitle: 'Work information',
    icon: 'mdi-briefcase',
    route: '/employment-information'
  },
  {
    title: 'Branch Selection',
    subtitle: 'Choose your branch',
    icon: 'mdi-office-building',
    route: '/branch'
  }
]);

// State
const currentStep = ref(1);
const completedSteps = ref([]);
const formData = ref({
  sampleField: ''
});

// Computed properties
const progressPercentage = computed(() => {
  return (completedSteps.value.length / onboardingSteps.value.length) * 100;
});

const progressColor = computed(() => {
  if (progressPercentage.value >= 80) return 'success';
  if (progressPercentage.value >= 50) return 'warning';
  return 'primary';
});

// Methods
const getCurrentStep = () => {
  return onboardingSteps.value[currentStep.value - 1] || {};
};

const getCurrentStepTitle = () => {
  return getCurrentStep().title || 'Unknown Step';
};

const getCurrentStepIcon = () => {
  return getCurrentStep().icon || 'mdi-circle';
};

const getCurrentStepColor = () => {
  if (completedSteps.value.includes(getCurrentStep().route)) return 'success';
  return 'primary';
};

const getCurrentStepDescription = () => {
  const descriptions = {
    'Basic Information': 'Please provide your personal information including name, date of birth, and contact details.',
    'Email Verification': 'We\'ve sent a verification code to your email address. Please enter it below.',
    'Address': 'Enter your current residential address for our records.',
    'ID Information': 'Upload clear photos of your identification documents.',
    'Employment': 'Provide information about your current employment status.',
    'Branch Selection': 'Choose your preferred branch location for account services.'
  };
  
  return descriptions[getCurrentStepTitle()] || 'Complete this step to continue.';
};

const handleStepChange = ({ stepIndex, step, currentStep: newStep }) => {
  console.log('Step changed:', { stepIndex, step, newStep });
};

const handleStepClick = ({ stepIndex, step }) => {
  goToStep(stepIndex + 1);
};

const goToStep = (stepNumber) => {
  if (stepNumber >= 1 && stepNumber <= onboardingSteps.value.length) {
    currentStep.value = stepNumber;
  }
};

const nextStep = () => {
  if (currentStep.value < onboardingSteps.value.length) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const completeCurrentStep = () => {
  const currentStepRoute = getCurrentStep().route;
  
  if (!completedSteps.value.includes(currentStepRoute)) {
    completedSteps.value.push(currentStepRoute);
  }
  
  // Move to next step
  nextStep();
  
  // Clear form data for demo
  formData.value.sampleField = '';
};

const resetProgress = () => {
  currentStep.value = 1;
  completedSteps.value = [];
  formData.value.sampleField = '';
};

const getStepStatusIcon = (stepNumber) => {
  const step = onboardingSteps.value[stepNumber - 1];
  if (completedSteps.value.includes(step?.route)) return 'mdi-check-circle';
  if (stepNumber === currentStep.value) return 'mdi-play-circle';
  return 'mdi-circle-outline';
};

const getStepStatusColor = (stepNumber) => {
  const step = onboardingSteps.value[stepNumber - 1];
  if (completedSteps.value.includes(step?.route)) return 'success';
  if (stepNumber === currentStep.value) return 'primary';
  return 'grey';
};

const getStepClass = (stepNumber) => {
  const classes = [];
  const step = onboardingSteps.value[stepNumber - 1];
  
  if (stepNumber === currentStep.value) {
    classes.push('current-step');
  }
  
  if (completedSteps.value.includes(step?.route)) {
    classes.push('completed-step');
  }
  
  return classes.join(' ');
};
</script>

<style scoped>
.onboarding-demo {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface-variant));
}

.demo-content {
  min-height: 200px;
}

:deep(.current-step) {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

:deep(.completed-step) {
  opacity: 0.8;
}

:deep(.v-list-item) {
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

:deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

@media (max-width: 960px) {
  .onboarding-demo {
    padding: 0;
  }
}
</style> 