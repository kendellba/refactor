<template>
  <div class="id-information-page">
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
              <!-- Header Section -->
              <div class="text-center mb-8">
                <v-img
                  :src="logoImage"
                  alt="Cathedral Engage"
                  class="mx-auto mb-4"
                  width="100"
                  height="100"
                />

                <h1 class="text-h4 font-weight-bold primary-text mb-2">ID Information</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Please provide your identification details
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <!-- Error Alert -->
                  <v-alert v-if="onboardingStore.apiSubmitError" type="error" variant="tonal" class="mb-4" density="compact">
                    {{ onboardingStore.apiSubmitError }}
                  </v-alert>

                  <!-- Form Content -->
                  <v-form @submit.prevent="handleSubmit">
                    <v-alert
                      v-if="formSubmitError"
                      type="error"
                      variant="tonal"
                      class="mb-4"
                      density="compact"
                    >
                      {{ formSubmitError }}
                    </v-alert>

                    <!-- First Form of ID -->
                    <v-card class="mb-4" variant="outlined">
                      <v-card-text class="pa-4">
                        <h3 class="text-h6 mb-3">First Form of ID</h3>
                        <v-select
                          v-model="formData.firstIdType"
                          label="Type of ID"
                          :items="idTypeOptions"
                          item-title="title"
                          item-value="value"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-card-account-details"
                          :error-messages="getFieldError('firstIdType')"
                          required
                        />

                        <v-text-field
                          v-model="formData.firstIdNumber"
                          label="ID Number"
                          :placeholder="getPlaceholderForIdType(formData.firstIdType)"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-pound"
                          :error-messages="getFieldError('firstIdNumber')"
                          required
                        />

                        <v-text-field
                          v-model="formData.firstExpiryDate"
                          label="Expiry Date"
                          type="date"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-calendar"
                          :min="minDate"
                          :max="maxExpiryDate"
                          :disabled="formData.firstIdType === 'Birth Certificate'"
                          :error-messages="getFieldError('firstExpiryDate')"
                          required
                        />

                        <v-file-input
                          :model-value="formData.firstIdDocument"
                          @update:model-value="(files) => handleFileUpload(files, 'firstIdDocument')"
                          :key="formKeyFirst"
                          label="Upload Primary ID"
                          variant="outlined"
                          density="comfortable"
                          chips
                          show-size
                          clearable
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          :error-messages="getFieldError('firstIdDocument')"
                          required
                          hint="Please upload a clear copy of the ID (max 20MB, one file)"
                          persistent-hint
                        />
                      </v-card-text>
                    </v-card>

                    <!-- Second Form of ID -->
                    <v-card class="mb-4" variant="outlined">
                      <v-card-text class="pa-4">
                        <h3 class="text-h6 mb-3">Second Form of ID</h3>
                        <v-select
                          v-model="formData.secondIdType"
                          label="Type of ID"
                          :items="secondIdTypeOptions"
                          item-title="title"
                          item-value="value"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-card-account-details"
                          :error-messages="getFieldError('secondIdType')"
                          required
                        />

                        <v-text-field
                          v-model="formData.secondIdNumber"
                          label="ID Number"
                          :placeholder="getPlaceholderForIdType(formData.secondIdType)"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-pound"
                          :error-messages="getFieldError('secondIdNumber')"
                          required
                        />

                        <v-text-field
                          v-model="formData.secondExpiryDate"
                          label="Expiry Date"
                          type="date"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-calendar"
                          :min="minDate"
                          :max="maxExpiryDate"
                          :disabled="formData.secondIdType === 'Birth Certificate'"
                          :error-messages="getFieldError('secondExpiryDate')"
                          required
                        />

                        <v-file-input
                          :model-value="formData.secondIdDocument"
                          @update:model-value="(files) => handleFileUpload(files, 'secondIdDocument')"
                          :key="formKeySecond"
                          label="Upload Secondary ID"
                          variant="outlined"
                          chips
                          show-size
                          clearable
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          :error-messages="getFieldError('secondIdDocument')"
                          required
                          hint="Please upload a clear copy of the ID (max 20MB, one file)"
                          persistent-hint
                        />
                      </v-card-text>
                    </v-card>

                    <!-- Navigation Buttons -->
                    <v-row>
                      <v-col cols="12" sm="6" order="2" order-sm="1" class="mb-2 mb-sm-0">
                        <v-btn
                          block
                          color="secondary"
                          variant="flat"
                          :disabled="isLoading"
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
                          :loading="isLoading"
                          height="44"
                          class="next-button"
                          append-icon="mdi-arrow-right"
                          type="submit"
                        >
                          {{ isLoading ? 'Processing...' : 'Next' }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
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

<script setup>
import { computed } from 'vue';
import { useIdInformationFormManager } from '@/features/onboarding/composables/useIdInformationFormManager.js';
import logoImage from '@/assets/Logo1.png';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import { useCompleteOnboardingStepper, COMPLETE_ONBOARDING_STEPS } from '@/composables/useCompleteOnboardingStepper.js';

const {
  formData,
  errors,
  serverErrors,
  formSubmitError,
  isLoading,
  handleSubmit: originalHandleSubmit,
  navigateToPrevious,
  handleFileUpload,
  formKeyFirst,
  formKeySecond,
  idTypeOptions,
  secondIdTypeOptions,
  minDate,
  maxExpiryDate,
  getPlaceholderForIdType,
  DEFAULT_BIRTH_CERTIFICATE_EXPIRY_DATE,
} = useIdInformationFormManager();

// Wrap the handleSubmit to mark step complete
const handleSubmit = async () => {
  const result = await originalHandleSubmit();
  // If submission was successful, mark step complete
  if (!formSubmitError.value && !Object.keys(errors.value || {}).length) {
    markStepComplete('/id-information');
  }
  return result;
};

const onboardingStore = useOnboardingStore();

// Initialize stepper for progress tracking
const {
  completedSteps,
  currentStepNumber,
  markStepComplete,
  navigateToStep
} = useCompleteOnboardingStepper();

// Stepper event handlers
const handleStepChange = ({ step }) => {
  console.log('Step changed:', step.title);
};

const handleStepClick = ({ step }) => {
  navigateToStep(step.route);
};

// Helper to combine Zod and server errors for a field
const getFieldError = (fieldName) => {
  return (errors.value && errors.value[fieldName]) || (serverErrors.value && serverErrors.value[fieldName]);
};
</script>

<style scoped>
/* Stepper styling */
.id-information-page {
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
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
}

.form-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.form-card {
  border-radius: 12px;
  background-color: white;
}

.primary-text {
  color: var(--v-primary-base);
}

.next-button,
.back-button {
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.v-card) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-input) {
  font-size: 0.95rem;
}

:deep(.v-btn) {
  height: 48px;
  border-radius: 8px;
}

/* Mobile specific styles */
@media (max-width: 959px) {
  .form-container {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .brand-section {
    position: relative;
    width: 100%;
    min-height: 300px;
  }

  .brand-logo {
    width: 180px;
  }
}

/* Ensure form content is scrollable on mobile */
@media (max-width: 600px) {
  .form-section {
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .form-container {
    min-height: auto;
    padding: 1rem;
  }

  .form-card {
    padding: 0.5rem;
    border-radius: 12px;
  }

  :deep(.v-card-text) {
    padding: 16px !important;
  }
}
</style> 