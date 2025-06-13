<template>
  <div class="due-diligence-page">
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
                  :src="LogoImage"
                  alt="Cathedral Engage"
                  class="mx-auto mb-4"
                  width="100"
                  height="100"
                />
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Due Diligence</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Due Diligence Information</p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <p class="text-body-1 mb-4">
                    As part of our commitment to regulatory compliance and ensuring the security of
                    our members, we may require all foreign nationals to complete additional due
                    diligence procedures which may include:
                  </p>

                  <v-list class="mb-4 bg-grey-lighten-4 rounded-lg">
                    <v-list-item
                      v-for="(item, index) in DUE_DILIGENCE_ITEMS"
                      :key="index"
                      class="py-2"
                    >
                      <template #prepend>
                        <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                      </template>
                      <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <v-btn
                    block
                    color="tertiary"
                    variant="outlined"
                    size="large"
                    class="mb-6"
                    href="https://drive.google.com/drive/folders/1t8z2oRVvDwJwXGtKQ7JAQGdsK7-IuZIN"
                    target="_blank"
                    prepend-icon="mdi-file-document-outline"
                  >
                    Laws and Regulations
                  </v-btn>

                  <v-row>
                    <v-col cols="12" sm="6" order="2" order-sm="1">
                      <v-btn
                        block
                        color="secondary"
                        variant="flat"
                        size="large"
                        height="44"
                        class="back-button"
                        prepend-icon="mdi-arrow-left"
                        @click="navigateToPrevious"
                      >
                        Back
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" order="1" order-sm="2">
                      <v-btn
                        block
                        color="primary"
                        variant="flat"
                        size="large"
                        height="44"
                        class="next-button"
                        append-icon="mdi-arrow-right"
                        @click="navigateToNext"
                      >
                        Next
                      </v-btn>
                    </v-col>
                  </v-row>

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
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <!-- Brand Section -->
      <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
        <div class="brand-overlay"></div>
        <v-img src="@/assets/Logo1.png" alt="Cathedral Engage" class="brand-logo" contain />
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import { useCompleteOnboardingStepper, COMPLETE_ONBOARDING_STEPS } from '@/composables/useCompleteOnboardingStepper.js';
import { DUE_DILIGENCE_ITEMS } from '@/features/onboarding/constants/due-diligence-options.js';
import type { StepChangeEvent, StepClickEvent } from '@/types';
import { type Ref } from 'vue';
import LogoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const router = useRouter();

// Initialize stepper for progress tracking
const { completedSteps, currentStepNumber, markStepComplete, navigateToStep } =
  useCompleteOnboardingStepper() as {
    completedSteps: Ref<string[]>;
    currentStepNumber: Ref<number>;
    markStepComplete: (route: string) => void;
    navigateToStep: (route: string) => void;
  };

// Stepper event handlers
const handleStepChange = (event: StepChangeEvent): void => {
  console.log('Step changed:', event.step.title);
};

const handleStepClick = (event: StepClickEvent): void => {
  navigateToStep(event.step.route);
};

const navigateToPrevious = (): void => {
  router.go(-1);
};

const navigateToNext = (): void => {
  // Mark current step as complete
  markStepComplete('/due-diligence');
  // Navigate to the next component in the onboarding flow
  router.push('/foreign-national-bank-information');
};
</script>

<style scoped>
/* Stepper styling */
.due-diligence-page {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.stepper-container {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.form-section {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
}

.form-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2.5rem 1.5rem;
}

.form-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.form-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.section-title {
  color: var(--v-primary-base);
  font-size: 2.25rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
  font-weight: 700;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: rgba(0, 0, 0, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.requirements-list {
  margin: 2rem 0;
  padding: 0;
  list-style: none;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(247, 248, 249, 0.7);
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.requirement-item:hover {
  background: rgba(247, 248, 249, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.requirement-icon {
  margin-right: 1rem;
  color: var(--v-primary-base);
  font-size: 1.5rem;
}

.requirement-text {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.8);
}

:deep(.v-field) {
  border-radius: 14px !important;
  box-shadow: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(247, 248, 249, 0.7) !important;
}

:deep(.v-field:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  background: rgba(247, 248, 249, 0.9) !important;
}

:deep(.v-field--focused) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(25, 118, 210, 0.15) !important;
  background: white !important;
}

:deep(.v-btn) {
  height: 54px;
  border-radius: 14px;
  font-weight: 600;
  letter-spacing: 0.25px;
  text-transform: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.next-button {
  flex: 1;
  position: relative;
}

:deep(.next-button.v-btn) {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

:deep(.next-button .v-btn__content) {
  color: white;
  font-weight: 600;
}

:deep(.next-button .v-btn__append) {
  color: white;
}

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.35);
}

.next-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
}

.back-button {
  flex: 1;
}

:deep(.back-button.v-btn) {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.8);
}

:deep(.back-button:hover) {
  background-color: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

:deep(.v-alert) {
  border-radius: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(var(--v-theme-error), 0.08) !important;
  border: 1px solid rgba(var(--v-theme-error), 0.1) !important;
}

/* Focus styles for better accessibility */
:deep(.v-field--focused) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Loading state animation */
:deep(.v-btn--loading .v-btn__loader) {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@media (max-width: 959px) {
  .form-container {
    padding: 2rem 1.25rem;
  }

  .action-buttons {
    flex-direction: column-reverse;
  }
}

@media (max-width: 600px) {
  .form-section {
    height: auto;
    min-height: 100vh;
  }

  .form-container {
    min-height: auto;
    padding: 1.75rem 1.25rem;
  }

  .form-card {
    padding: 1.75rem;
    border-radius: 20px;
  }

  .section-title {
    font-size: 2rem;
  }

  .requirement-item {
    padding: 0.875rem;
    border-radius: 12px;
  }

  .requirement-icon {
    font-size: 1.25rem;
  }

  .requirement-text {
    font-size: 0.9375rem;
  }

  :deep(.v-field) {
    border-radius: 12px !important;
  }

  :deep(.v-btn) {
    height: 50px;
    border-radius: 12px;
  }
}
</style> 