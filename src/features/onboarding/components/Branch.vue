<template>
  <div class="branch-page">
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
                <div class="text-center mb-4 mb-sm-8">
                  <v-img
                    :src="logoImage"
                    alt="Cathedral Engage"
                    class="mx-auto mb-3"
                    width="80"
                    height="80"
                    :width-sm="100"
                    :height-sm="100"
                  />
                  <h1 class="text-h5 text-sm-h4 font-weight-bold primary-text mb-1 mb-sm-2">
                    Branch Selection
                  </h1>
                  <p class="text-subtitle-2 text-sm-subtitle-1 text-medium-emphasis">
                    Choose your preferred branch and contact preferences
                  </p>
                </div>

                <v-card class="form-card" elevation="0" rounded="lg">
                  <v-card-text>
                    <v-form @submit.prevent="handleSubmit">
                      <v-alert
                        v-if="formAlertError"
                        type="error"
                        variant="tonal"
                        class="mb-4"
                        density="compact"
                      >
                        {{ formAlertError }}
                      </v-alert>

                      <v-select
                        v-model="formData.selectedBranch"
                        label="Branch"
                        :items="BRANCH_OPTIONS"
                        item-title="title"
                        item-value="value"
                        variant="outlined"
                        density="comfortable"
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-office-building"
                        required
                        class="mb-4"
                        :error="!!fieldErrors?.selectedBranch"
                        @update:model-value="validateFormField('selectedBranch', formData)"
                        @blur="validateFormField('selectedBranch', formData)"
                      >
                        <template v-if="fieldErrors?.selectedBranch" #details>
                          <div class="custom-error-message pa-1 text-caption text-error">
                            <v-icon size="small" color="error" class="mr-1"
                              >mdi-alert-circle</v-icon
                            >
                            {{ fieldErrors.selectedBranch }}
                          </div>
                        </template>
                      </v-select>

                      <v-card class="mb-4 pa-3 pa-sm-4" variant="outlined">
                        <v-card-title class="text-subtitle-2 text-sm-subtitle-1 mb-2"
                          >Choose your preferred method of contact</v-card-title
                        >
                        <v-divider class="mb-3"></v-divider>
                        <v-radio-group
                          v-model="formData.preferredContactMethod"
                          density="compact"
                          :error="!!fieldErrors?.preferredContactMethod"
                          @change="validateFormField('preferredContactMethod', formData)"
                        >
                          <v-radio
                            v-for="option in PREFERRED_CONTACT_METHOD_OPTIONS"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                          ></v-radio>
                        </v-radio-group>
                        <div
                          v-if="fieldErrors?.preferredContactMethod"
                          class="custom-error-message pa-1 text-caption text-error"
                        >
                          <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                          {{ fieldErrors.preferredContactMethod }}
                        </div>
                      </v-card>

                      <v-card class="mb-5 pa-3 pa-sm-4" variant="outlined">
                        <v-card-title class="text-subtitle-2 text-sm-subtitle-1 mb-2"
                          >Please choose the best time to contact you</v-card-title
                        >
                        <v-divider class="mb-3"></v-divider>
                        <v-radio-group
                          v-model="formData.bestContactTime"
                          density="compact"
                          :error="!!fieldErrors?.bestContactTime"
                          @change="validateFormField('bestContactTime', formData)"
                        >
                          <v-radio
                            v-for="option in BEST_CONTACT_TIME_OPTIONS"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                          ></v-radio>
                        </v-radio-group>
                        <div
                          v-if="fieldErrors?.bestContactTime"
                          class="custom-error-message pa-1 text-caption text-error"
                        >
                          <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                          {{ fieldErrors.bestContactTime }}
                        </div>
                      </v-card>

                      <v-divider class="my-4 my-sm-6"></v-divider>

                      <v-row class="mt-4 mt-sm-6">
                        <v-col cols="12" sm="6" order="2" order-sm="1">
                          <v-btn
                            block
                            color="secondary"
                            size="large"
                            height="44"
                            variant="flat"
                            class="back-button"
                            @click="navigateToPrevious"
                          >
                            <v-icon start>mdi-arrow-left</v-icon>
                            Back
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" order="1" order-sm="2">
                          <v-btn
                            block
                            color="primary"
                            variant="elevated"
                            height="44"
                            size="large"
                            type="submit"
                            :loading="onboardingStore.isLoading"
                            class="next-button mb-3 mb-sm-0"
                          >
                            {{ onboardingStore.isLoading ? 'Processing...' : 'Next' }}
                            <v-icon end>mdi-arrow-right</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <div class="text-center mt-4 mt-sm-6 pb-4">
            <span class="text-caption text-medium-emphasis d-block mb-2">Powered by</span>
            <v-img
              :src="bigLogo"
              alt="Powered By"
              class="mx-auto logo-image"
              width="120"
              height="40"
              :width-sm="150"
              :height-sm="50"
              contain
            />
          </div>
        </v-col>

        <!-- Brand Section -->
        <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
          <div class="brand-overlay"></div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useBranchFormManager } from '@/features/onboarding/composables/useBranchFormManager.js';
import {
  BRANCH_OPTIONS,
  PREFERRED_CONTACT_METHOD_OPTIONS,
  BEST_CONTACT_TIME_OPTIONS,
} from '@/features/onboarding/constants/branch-options.js';
import logoImage from '@/assets/Logo1.png'; // Updated path
import bigLogo from '@/assets/bigLogo.png'; // Updated path
import { onMounted, onBeforeUnmount } from 'vue';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import { useCompleteOnboardingStepper } from '@/composables/useCompleteOnboardingStepper.js';
import { COMPLETE_ONBOARDING_STEPS } from '@/composables/useCompleteOnboardingStepper.js';
// FormFieldError component is not used directly if errors are handled inline or via formAlertError

const router = useRouter();
const onboardingStore = useOnboardingStore();

const {
  formData,
  fieldErrors,
  formAlertError,
  validate,
  validateFormField,
  clearErrors,
  clearPersistedFormState,
} = useBranchFormManager();

// Initialize stepper for progress tracking
const { completedSteps, currentStepNumber, markStepComplete, navigateToStep } =
  useCompleteOnboardingStepper();

// Stepper event handlers
const handleStepChange = (newStep) => {
  console.log('Step changed to:', newStep);
};

const handleStepClick = (stepIndex) => {
  navigateToStep(stepIndex);
};

const handleSubmit = async () => {
  try {
    clearErrors(); // Clear previous Zod errors

    const validationResult = await validate(formData.value);
    if (!validationResult.isValid) {
      return;
    }

    const storeSubmissionResult = await onboardingStore.submitBranchData(formData.value);

    if (storeSubmissionResult.success) {
      markStepComplete('branch');
      clearPersistedFormState(); // Clear localStorage and reset formData in composable
      await router.push('/success');
    } else {
      // Use processed errors from the Pinia store action's result
      if (storeSubmissionResult.fieldMessages) {
        fieldErrors.value = { ...fieldErrors.value, ...storeSubmissionResult.fieldMessages };
      }
      if (storeSubmissionResult.generalMessage) {
        formAlertError.value = storeSubmissionResult.generalMessage;
      } else if (!Object.keys(storeSubmissionResult.fieldMessages || {}).length) {
        // Fallback general error if store didn't provide one and no field errors
        formAlertError.value = 'An unexpected error occurred during submission.';
      }
    }
  } catch (error) {
    formAlertError.value = 'An unexpected error occurred. Please try again.';
  }
};

const navigateToPrevious = () => {
  try {
    router.go(-1);
  } catch (error) {
    router.push('/power-of-attorney');
  }
};

onMounted(() => {
  // Initialize form data if needed
  if (!formData.value) {
    formData.value = {
      selectedBranch: '',
      preferredContactMethod: '',
      bestContactTime: '',
    };
  }
});

onBeforeUnmount(() => {
  // Clean up any subscriptions or timers if needed
  clearErrors();
});

// All onMounted, onBeforeUnmount, watch for localStorage, and direct API calls
// are now handled by useBranchFormManager or onboardingStore.
</script>

<style scoped>
/* Stepper styles */
.branch-page {
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

.primary-text {
  color: var(--v-primary-base);
  font-size: 2.25rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
  font-weight: 700;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
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

:deep(.v-card) {
  /* This targets the inner v-cards for radio groups */
  border: none !important;
  border-radius: 18px !important;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

:deep(.v-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important;
}

:deep(.v-btn) {
  height: 54px;
  border-radius: 14px;
  font-weight: 600;
  letter-spacing: 0.25px;
  text-transform: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.next-button {
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
  border: 2px solid rgba(0, 0, 0, 0.05) !important;
}

.back-button:hover {
  transform: translateY(-2px);
  background: rgba(0, 0, 0, 0.02) !important;
}

:deep(.v-radio-group) {
  margin-top: 12px;
}

:deep(.v-radio) {
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

:deep(.v-radio:hover) {
  transform: translateX(4px);
}

:deep(.v-selection-control__input) {
  transform: scale(1.1);
}

:deep(.v-selection-control__wrapper) {
  margin-inline-end: 14px;
}

:deep(.v-alert) {
  border-radius: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(var(--v-theme-error), 0.08) !important;
  border: 1px solid rgba(var(--v-theme-error), 0.1) !important;
}

:deep(.v-divider) {
  opacity: 0.06;
}

:deep(.v-select__content) {
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98);
}

:deep(.v-label.v-field-label) {
  opacity: 0.85;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

:deep(.v-field--focused .v-label.v-field-label) {
  color: var(--v-primary-base);
  opacity: 1;
}

:deep(.v-label.v-field-label--required::after) {
  content: ' *';
  color: var(--v-error-base);
  font-size: 1.1em;
}

@media (max-width: 959px) {
  .form-container {
    padding: 2rem 1.25rem;
  }

  .brand-section {
    min-height: 220px;
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

  .primary-text {
    font-size: 2rem;
  }

  :deep(.v-field) {
    border-radius: 12px !important;
  }

  :deep(.v-btn) {
    height: 50px;
    border-radius: 12px;
  }

  :deep(.v-card) {
    border-radius: 16px !important;
  }
}

:deep(.v-field--focused) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

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

.form-section {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
}

.logo-image {
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.custom-error-message {
  /* For radio group errors */
  font-size: 0.75rem; /* Vuetify's default error message size */
  padding-top: 4px;
}
</style>
