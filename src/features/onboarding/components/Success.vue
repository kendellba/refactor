<template>
  <div class="success-page">
    <!-- Onboarding Stepper -->
    <div class="stepper-container">
      <v-container>
        <SimpleStepper
          :steps="COMPLETE_ONBOARDING_STEPS"
          :completed-steps="completedSteps"
          :initial-step="currentStepNumber"
          :allow-step-navigation="true"
          @step-change="handleStepChange"
          @step-click="handleStepClick"
        />
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="fill-height" fluid>
      <v-row no-gutters>
        <!-- Form Section -->
        <v-col cols="12" md="6" class="form-section">
          <v-container class="form-container">
            <v-row justify="center" align="center">
              <v-col cols="12" sm="10" md="10" lg="9">
                <div class="text-center mb-8">
                  <v-img
                    :src="logoImage"
                    alt="Cathedral Engage"
                    class="mx-auto mb-4"
                    width="100"
                    height="100"
                  />
                  <h1 class="text-h4 font-weight-bold primary-text mb-2">
                    Registration Successful!
                  </h1>
                  <p class="text-subtitle-1 text-medium-emphasis">Your account has been created</p>
                </div>

                <v-card class="form-card" elevation="0" rounded="lg">
                  <v-card-text>
                    <v-alert
                      v-if="pageManager.apiSubmitError.value"
                      type="error"
                      variant="tonal"
                      class="mb-4"
                    >
                      {{ pageManager.apiSubmitError.value }}
                    </v-alert>

                    <div class="text-center py-6">
                      <v-progress-circular
                        v-if="pageManager.isLoading.value"
                        indeterminate
                        color="primary"
                        size="64"
                        width="6"
                        class="mb-6"
                      ></v-progress-circular>

                      <v-icon
                        v-else-if="pageManager.accountCreated.value"
                        icon="mdi-check-circle"
                        color="success"
                        size="64"
                        class="mb-6"
                      ></v-icon>

                      <h2 class="text-h5 font-weight-bold mb-2">
                        {{ pageManager.statusMessage.value }}
                      </h2>
                      <p class="text-body-1 text-medium-emphasis mb-6">
                        {{ pageManager.subMessage.value }}
                      </p>

                      <v-btn
                        v-if="pageManager.accountCreated.value"
                        color="primary"
                        size="large"
                        variant="flat"
                        height="50"
                        class="next-button"
                        @click="pageManager.navigateToLogin"
                      >
                        Go to Login
                        <v-icon end>mdi-arrow-right</v-icon>
                      </v-btn>

                      <v-btn
                        v-if="pageManager.isAdmin.value"
                        color="secondary"
                        size="large"
                        variant="flat"
                        height="50"
                        class="next-button mt-4"
                        @click="pageManager.navigateToApprovals"
                      >
                        View Pending Approvals
                        <v-icon end>mdi-clipboard-check</v-icon>
                      </v-btn>

                      <v-btn
                        v-if="pageManager.apiSubmitError.value && !pageManager.isLoading.value"
                        color="primary"
                        size="large"
                        variant="flat"
                        height="50"
                        class="next-button"
                        :loading="pageManager.isRetrying.value"
                        @click="pageManager.retry"
                      >
                        Retry
                        <v-icon end>mdi-refresh</v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>

                <div class="text-center mt-6 pb-4">
                  <span class="text-caption text-medium-emphasis d-block mb-2">Powered by</span>
                  <v-img
                    :src="bigLogo"
                    alt="Powered By"
                    class="mx-auto logo-image"
                    width="150"
                    height="50"
                    contain
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>

        <!-- Brand Section -->
        <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
          <div class="brand-overlay"></div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from 'vue';
import { useSuccessPageManager } from '@/features/onboarding/composables/useSuccessPageManager.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import { useCompleteOnboardingStepper } from '@/composables/useCompleteOnboardingStepper.js';
import { COMPLETE_ONBOARDING_STEPS } from '@/composables/useCompleteOnboardingStepper.js';
import type { StepChangeEvent } from '@/types';

const pageManager = useSuccessPageManager() as {
  apiSubmitError: Ref<string | null>;
  isLoading: Ref<boolean>;
  accountCreated: Ref<boolean>;
  statusMessage: Ref<string>;
  subMessage: Ref<string>;
  isAdmin: Ref<boolean>;
  isRetrying: Ref<boolean>;
  navigateToLogin: () => void;
  navigateToApprovals: () => void;
  retry: () => void;
};

// Initialize stepper for progress tracking
const { completedSteps, currentStepNumber, markStepComplete, navigateToStep } =
  useCompleteOnboardingStepper() as {
    completedSteps: Ref<string[]>;
    currentStepNumber: Ref<number>;
    markStepComplete: (stepId: string) => void;
    navigateToStep: (stepIndex: number) => void;
  };

// Mark success step as complete when component mounts
markStepComplete('success');

// Stepper event handlers
const handleStepChange = (event: StepChangeEvent): void => {
  console.log('Step changed to:', event);
};

const handleStepClick = (event: { stepIndex: number; step: any }): void => {
  navigateToStep(event.stepIndex);
};
</script>

<style scoped>
/* Stepper styles */
.success-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.stepper-container {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section {
  background: #f9fafc;
  min-height: 100vh;
  overflow-y: auto;
}

.form-container {
  max-width: 100%;
  padding: 2rem 1rem;
}

.form-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.primary-text {
  color: var(--v-primary-base, #1976d2);
}

.next-button {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

@media (max-width: 600px) {
  .form-section {
    height: auto;
    min-height: 100vh;
  }

  .form-container {
    padding: 1rem;
    height: auto;
  }

  .form-card {
    padding: 0.5rem;
    border-radius: 12px;
  }
}
</style>
