<template>
  <div class="address-page">
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
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Address</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Enter your residential address information
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-form @submit.prevent="handleSubmit">
                    <v-alert v-if="formAlertError" type="error" variant="tonal" class="mb-4">
                      {{ formAlertError }}
                    </v-alert>

                    <v-text-field
                      v-model="formData.addressLine1"
                      label="Address Line 1"
                      placeholder="Enter address line 1"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-map-marker"
                      required
                      :error="!!fieldErrors.addressLine1"
                      :append-inner-icon="fieldErrors.addressLine1 ? 'mdi-alert-circle' : undefined"
                      @blur="() => validateFormField('addressLine1')"
                    >
                      <template v-if="fieldErrors.addressLine1" #details>
                        <!-- FormFieldError removed -->
                      </template>
                    </v-text-field>

                    <v-text-field
                      v-model="formData.addressLine2"
                      label="Address Line 2"
                      placeholder="Enter address line 2"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-map-marker"
                      :error="!!fieldErrors.addressLine2"
                      :append-inner-icon="fieldErrors.addressLine2 ? 'mdi-alert-circle' : undefined"
                      @blur="() => validateFormField('addressLine2')"
                    >
                      <template v-if="fieldErrors.addressLine2" #details>
                        <!-- FormFieldError removed -->
                      </template>
                    </v-text-field>

                    <v-text-field
                      v-model="formData.city"
                      label="City"
                      placeholder="Enter city"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-city"
                      required
                      :error="!!fieldErrors.city"
                      :append-inner-icon="fieldErrors.city ? 'mdi-alert-circle' : undefined"
                      @blur="() => validateFormField('city')"
                    >
                      <template v-if="fieldErrors.city" #details>
                        <!-- FormFieldError removed -->
                      </template>
                    </v-text-field>

                    <v-select
                      v-model="formData.country"
                      label="Country"
                      :items="countryList"
                      item-title="name"
                      item-value="code"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-earth"
                      required
                      :error="!!fieldErrors.country"
                      :append-inner-icon="fieldErrors.country ? 'mdi-alert-circle' : undefined"
                      @update:modelValue="() => validateFormField('country')"
                    >
                      <template v-if="fieldErrors.country" #details>
                        <!-- FormFieldError removed -->
                      </template>
                    </v-select>

                    <v-select
                      v-model="formData.dwellingStatus"
                      label="Dwelling Status"
                      :items="dwellingStatusOptions"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-home"
                      required
                      :error="!!fieldErrors.dwellingStatus"
                      :append-inner-icon="
                        fieldErrors.dwellingStatus ? 'mdi-alert-circle' : undefined
                      "
                      @update:modelValue="() => validateFormField('dwellingStatus')"
                    >
                      <template v-if="fieldErrors.dwellingStatus" #details>
                        <!-- FormFieldError removed -->
                      </template>
                    </v-select>

                    <v-select
                      v-model="formData.utilityBillType"
                      label="Utility Bill Type"
                      :items="utilityBillTypeOptions"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-file-document"
                      required
                      class="mt-3"
                      :error="!!fieldErrors.utilityBillType"
                      :append-inner-icon="
                        fieldErrors.utilityBillType ? 'mdi-alert-circle' : undefined
                      "
                      @update:modelValue="() => validateFormField('utilityBillType')"
                    >
                      <template v-if="fieldErrors.utilityBillType" #details>
                        <!-- FormFieldError removed -->
                      </template>
                    </v-select>

                    <v-file-input
                      v-model="formData.proofOfAddress"
                      label="Upload Proof of Address"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-upload"
                      chips
                      multiple
                      required
                      accept="image/*,.pdf"
                      class="mt-4"
                      show-size
                      counter
                      hint="Please upload a clear copy of your proof of address (max 20MB)"
                      persistent-hint
                      :error="!!fieldErrors.proofOfAddress"
                      :append-inner-icon="
                        fieldErrors.proofOfAddress ? 'mdi-alert-circle' : undefined
                      "
                      @change="() => validateFormField('proofOfAddress')"
                    >
                      <template v-if="fieldErrors.proofOfAddress" #details>
                        <!-- FormFieldError removed -->
                      </template>
                    </v-file-input>

                    <v-divider class="my-6"></v-divider>

                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          size="large"
                          height="50"
                          variant="flat"
                          class="back-button"
                          :disabled="onboardingStore.isLoading"
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
                          size="large"
                          height="50"
                          variant="flat"
                          type="submit"
                          :loading="onboardingStore.isLoading"
                          class="next-button"
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

      <!-- Brand Section -->
      <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
        <div class="brand-overlay"></div>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onBeforeUnmount, type Ref } from 'vue';
import { useDemoStore } from '@/store/demoStore';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
// FormFieldError removed
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useAddressFormManager } from '@/features/onboarding/composables/useAddressFormManager.js';
import { useCompleteOnboardingStepper, COMPLETE_ONBOARDING_STEPS } from '@/composables/useCompleteOnboardingStepper.js';
import {
  countryList,
  dwellingStatusOptions,
  utilityBillTypeOptions,
} from '@/features/onboarding/constants/address-options';
import type { AddressFormData, FormErrors, StepChangeEvent, StepClickEvent } from '@/types';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const router = useRouter();
const demoStore = useDemoStore();
const onboardingStore = useOnboardingStore();

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

const {
  formData,
  fieldErrors,
  formAlertError,
  validate,
  validateFormField,
  clearErrors,
  clearPersistedFormState
} = useAddressFormManager() as any;

const handleSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();
  clearErrors();

  console.log('=== Address Form Submission Started ===');
  console.log('Form data:', formData.value);

  const isValid = await validate(formData.value);
  console.log('Validation result:', isValid);
  
  if (!isValid) {
    console.log('Validation failed, field errors:', fieldErrors.value);
    return;
  }

  console.log('Validation passed, submitting to store...');
  const storeSubmissionResult = await onboardingStore.submitAddressData(formData.value) as {
    success: boolean;
    fieldMessages?: FormErrors;
    generalMessage?: string;
  };
  console.log('Store submission result:', storeSubmissionResult);

  if (storeSubmissionResult.success) {
    // Mark current step as complete
    markStepComplete('/address');
    clearPersistedFormState();
    router.push('/mailing-address');
  } else {
    if (storeSubmissionResult.fieldMessages) {
      fieldErrors.value = { ...storeSubmissionResult.fieldMessages };
    }
    if (storeSubmissionResult.generalMessage) {
      formAlertError.value = storeSubmissionResult.generalMessage;
    } else {
      formAlertError.value = 'An unexpected error occurred.';
    }
  }
};

const navigateToPrevious = (): void => {
  router.go(-1);
};

// Helper function to get error message as string for FormFieldError component
const getErrorMessage = (error: string | string[] | undefined): string => {
  if (!error) return '';
  return Array.isArray(error) ? error[0] : error;
};
</script>

<style scoped>
/* Stepper styling */
.address-page {
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

:deep(.v-field) {
  border-radius: 8px !important;
  box-shadow: none !important;
}

:deep(.v-field__outline) {
  opacity: 1 !important;
}

.next-button {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.back-button {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
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
