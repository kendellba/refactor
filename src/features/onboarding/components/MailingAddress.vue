<template>
  <div class="mailing-address-page">
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
                <v-img :src="logoImage" alt="Cathedral Engage" class="mx-auto mb-4" width="100" height="100" />
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Mailing Address</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Enter your mailing address details</p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-form @submit.prevent="handleSubmit">
                    <!-- Error Alert -->
                    <v-alert v-if="onboardingStore.apiSubmitError || manager.submissionError.value" type="error" variant="tonal" class="mb-4" density="compact">
                      {{ onboardingStore.apiSubmitError || manager.submissionError.value }}
                    </v-alert>

                    <v-checkbox
                      v-model="manager.formData.value.sameAsResidential"
                      label="Mailing address is the same as residential"
                      class="mb-4"
                    />

                    <template v-if="!manager.formData.value.sameAsResidential">
                      <v-text-field
                        v-model="manager.formData.value.address_line_1"
                        label="Address Line 1"
                        placeholder="Enter street address"
                        variant="outlined"
                        prepend-inner-icon="mdi-map-marker"
                        required
                        :error-messages="manager.fieldErrors.value.address_line_1"
                      />
                      <v-text-field
                        v-model="manager.formData.value.address_line_2"
                        label="Address Line 2 (Optional)"
                        placeholder="Apartment, suite, etc."
                        variant="outlined"
                        prepend-inner-icon="mdi-map-marker-outline"
                      />
                      <v-text-field
                        v-model="manager.formData.value.city"
                        label="City / Town"
                        placeholder="Enter city or town"
                        variant="outlined"
                        prepend-inner-icon="mdi-city"
                        required
                        :error-messages="manager.fieldErrors.value.city"
                      />
                      <v-autocomplete
                        v-model="manager.formData.value.country"
                        :items="countryList"
                        label="Country"
                        placeholder="Select country"
                        variant="outlined"
                        prepend-inner-icon="mdi-flag"
                        required
                        :error-messages="manager.fieldErrors.value.country"
                      />
                      <v-file-input
                        label="Proof of Address (e.g., Utility Bill)"
                        variant="outlined"
                        multiple
                        chips
                        show-size
                        prepend-icon="mdi-file-document"
                        :error-messages="manager.fieldErrors.value.proof_of_address_files"
                        @update:model-value="manager.handleFileChange"
                      />
                    </template>
                    
                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn block color="secondary" variant="flat" size="large" @click="navigateToPrevious">
                          Back
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="1" order-sm="2">
                        <v-btn block color="primary" variant="flat" size="large" type="submit" :loading="manager.isLoading.value">
                          {{ manager.isLoading.value ? 'Submitting...' : 'Next' }}
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
      <v-col cols="12" md="6" class="brand-section d-none d-md-flex" />
    </v-row>
  </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMailingAddressFormManager } from '@/features/onboarding/composables/useMailingAddressFormManager.js';
import { countryList } from '@/shared/constants/countries.js';
import logoImage from '@/assets/Logo1.png';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import {
  useCompleteOnboardingStepper,
  COMPLETE_ONBOARDING_STEPS,
} from '@/composables/useCompleteOnboardingStepper.js';

const router = useRouter();
const manager = useMailingAddressFormManager();
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

const handleSubmit = async () => {
  const result = await manager.handleSubmit();
  // If submission was successful, mark step complete
  if (result === true) {
    markStepComplete('/mailing-address');
  }
  return result;
};

const navigateToPrevious = () => {
  manager.clearPersistedFormState();
  router.go(-1);
};
</script>

<style scoped>
/* Stepper styling */
.mailing-address-page {
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

.form-section { background: #f9fafc; min-height: 100vh; overflow-y: auto; }
.form-container { max-width: 100%; padding: 2rem 1rem; }
.form-card { background-color: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 16px; padding: 1rem; }
</style>
