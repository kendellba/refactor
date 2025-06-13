<template>
  <div class="designation-of-beneficiary-page">
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
    <v-container fluid>
    <v-row no-gutters>
      <!-- Form Section -->
      <v-col cols="12" md="6" class="form-section">
        <v-container class="form-container">
          <v-row justify="center" align="start">
            <v-col cols="12" sm="10" md="10" lg="9">
              <div class="text-center mb-3">
                <v-img
                  :src="logoImage"
                  alt="Cathedral Engage"
                  class="mx-auto mb-2"
                  width="70"
                  height="70"
                />
                <h1 class="text-h4 font-weight-bold primary-text mb-3">
                  Designation of Beneficiary
                </h1>
                <p class="text-subtitle-2 text-medium-emphasis">
                  Add beneficiaries to your account
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <!-- Page-level alert for messages like 'Total percentage must be 100%' -->
                  <v-alert
                    v-if="formWideAlert"
                    type="warning" 
                    variant="tonal"
                    class="mb-3"
                    density="compact"
                  >
                    {{ formWideAlert }}
                  </v-alert>

                  <!-- Existing Beneficiaries List -->
                  <div v-if="addedBeneficiariesList.length > 0" class="mb-3">
                    <h2 class="text-subtitle-1 font-weight-medium mb-2">Current Beneficiaries</h2>
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span class="text-body-2 text-medium-emphasis">
                        {{ addedBeneficiariesList.length }}
                        {{ addedBeneficiariesList.length === 1 ? 'beneficiary' : 'beneficiaries' }} added
                      </span>
                      <v-chip
                        :color="totalPercentageAdded === 100 ? 'success' : (totalPercentageAdded > 100 ? 'error' : 'warning')"
                        size="small"
                        class="percentage-chip"
                      >
                        {{ totalPercentageAdded }}% / 100% allocated
                      </v-chip>
                    </div>
                    <v-list class="pa-0 beneficiary-list">
                      <v-list-item
                        v-for="(beneficiary, index) in addedBeneficiariesList"
                        :key="index" 
                        class="mb-2 rounded beneficiary-item"
                        density="compact"
                      >
                        <template #prepend>
                          <v-avatar color="primary" size="36">
                            <span class="text-white">{{ index + 1 }}</span>
                          </v-avatar>
                        </template>

                        <v-list-item-title class="text-subtitle-2 font-weight-medium">
                          {{ beneficiary.first_name }} {{ beneficiary.last_name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-caption">
                          {{ beneficiary.relationship_to_beneficiary }} •
                          {{ beneficiary.percent_of_beneficiary_interest }}% interest
                        </v-list-item-subtitle>

                        <template #append>
                          <v-btn
                            icon
                            variant="text"
                            color="error"
                            size="small"
                            @click="openConfirmRemoveDialog(index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>

                  <!-- Form for adding/editing a beneficiary -->
                  <v-form @submit.prevent="handleAddOrUpdateCurrentBeneficiary">
                    <v-alert
                      v-if="currentBeneficiaryFormAlert"
                      type="error"
                      variant="tonal"
                      class="mb-3"
                      density="compact"
                    >
                      {{ currentBeneficiaryFormAlert }}
                    </v-alert>

                    <v-card class="mb-3" variant="outlined">
                      <v-card-text class="pa-3">
                        <p class="text-subtitle-2 font-weight-medium mb-2 section-title">
                          {{ addedBeneficiariesList.length > 0 ? 'Add New Beneficiary' : 'Beneficiary Information' }}
                        </p>

                        <div class="form-section personal-info-section">
                          <v-row dense>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="currentBeneficiaryFormData.first_name"
                                label="First Name"
                                placeholder="Enter first name"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-account"
                                                :error="!!(currentBeneficiaryFieldErrors?.first_name)"
                :error-messages="currentBeneficiaryFieldErrors?.first_name"

                                required
                                class="mb-2"
                              />
                            </v-col>

                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="currentBeneficiaryFormData.last_name"
                                label="Last Name"
                                placeholder="Enter last name"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-account"
                                                :error="!!(currentBeneficiaryFieldErrors?.last_name)"
                :error-messages="currentBeneficiaryFieldErrors?.last_name"

                                required
                                class="mb-2"
                              />
                            </v-col>
                          </v-row>

                          <v-text-field
                            v-model="currentBeneficiaryFormData.middle_name"
                            label="Middle Name"
                            placeholder="Enter middle name (optional)"
                            variant="outlined"
                            density="comfortable"
                            bg-color="grey-lighten-5"
                            prepend-inner-icon="mdi-account"
                                            :error="!!(currentBeneficiaryFieldErrors?.middle_name)"
                :error-messages="currentBeneficiaryFieldErrors?.middle_name"
                            
                            class="mb-2"
                          />

                          <v-row dense>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="currentBeneficiaryFormData.dob"
                                label="Date of Birth"
                                type="date"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-calendar"
                                                :error="!!(currentBeneficiaryFieldErrors?.dob)"
                :error-messages="currentBeneficiaryFieldErrors?.dob"

                                required
                                class="mb-2"
                              />
                            </v-col>

                            <v-col cols="12" sm="6">
                              <v-select
                                v-model="currentBeneficiaryFormData.gender"
                                label="Gender"
                                :items="['Male', 'Female']" 
                                placeholder="Select gender"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-gender-male-female"
                                                :error="!!(currentBeneficiaryFieldErrors?.gender)"
                :error-messages="currentBeneficiaryFieldErrors?.gender"

                                required
                                class="mb-2"
                              />
                            </v-col>
                          </v-row>
                        </div>

                        <p class="text-subtitle-2 font-weight-medium mt-5 mb-3 section-title">
                          Address Information
                        </p>

                        <div class="form-section address-section">
                          <v-text-field
                            v-model="currentBeneficiaryFormData.address_line_1"
                            label="Address Line 1"
                            placeholder="Enter address line 1"
                            variant="outlined"
                            density="comfortable"
                            bg-color="grey-lighten-5"
                            prepend-inner-icon="mdi-map-marker"
                                            :error="!!(currentBeneficiaryFieldErrors?.address_line_1)"
                :error-messages="currentBeneficiaryFieldErrors?.address_line_1"
                            
                            required
                            class="mb-2"
                          />

                          <v-text-field
                            v-model="currentBeneficiaryFormData.address_line_2"
                            label="Address Line 2"
                            placeholder="Enter address line 2 (optional)"
                            variant="outlined"
                            density="comfortable"
                            bg-color="grey-lighten-5"
                            prepend-inner-icon="mdi-map-marker"
                                            :error="!!(currentBeneficiaryFieldErrors?.address_line_2)"
                :error-messages="currentBeneficiaryFieldErrors?.address_line_2"
                            
                            class="mb-2"
                          />

                          <v-row dense>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="currentBeneficiaryFormData.city"
                                label="City"
                                placeholder="Enter city"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-city"
                                                :error="!!(currentBeneficiaryFieldErrors?.city)"
                :error-messages="currentBeneficiaryFieldErrors?.city"
                                
                                required
                                class="mb-2"
                              />
                            </v-col>

                            <v-col cols="12" sm="6">
                              <v-select
                                v-model="currentBeneficiaryFormData.country"
                                label="Country"
                                :items="countryList" 
                                item-title="name"
                                item-value="code"
                                placeholder="Select country"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-earth"
                                                :error="!!(currentBeneficiaryFieldErrors?.country)"
                :error-messages="currentBeneficiaryFieldErrors?.country"
                                
                                required
                                class="mb-2"
                              />
                            </v-col>
                          </v-row>
                        </div>

                        <p class="text-subtitle-2 font-weight-medium mt-5 mb-3 section-title">
                          Beneficiary Details
                        </p>

                        <div class="form-section beneficiary-details-section">
                          <v-row dense>
                            <v-col cols="12" sm="6">
                              <v-autocomplete
                                v-model="currentBeneficiaryFormData.relationship_to_beneficiary"
                                :items="RELATIONSHIP_OPTIONS"
                                label="Relationship to Beneficiary"
                                placeholder="Start typing relationship"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-account-group"
                                                :error="!!(currentBeneficiaryFieldErrors?.relationship_to_beneficiary)"
                :error-messages="currentBeneficiaryFieldErrors?.relationship_to_beneficiary"
                                
                                required
                                clearable
                                auto-select-first
                                hide-no-data
                                class="mb-2"
                              />
                            </v-col>

                            <v-col cols="12" sm="6">
                              <div class="d-flex flex-column">
                                <v-text-field
                                  v-model="currentBeneficiaryFormData.percent_of_beneficiary_interest"
                                  label="Percentage of Interest"
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  placeholder="Enter percentage"
                                  variant="outlined"
                                  density="comfortable"
                                  bg-color="grey-lighten-5"
                                  prepend-inner-icon="mdi-percent"
                                                  :error="!!(currentBeneficiaryFieldErrors?.percent_of_beneficiary_interest)"
                :error-messages="currentBeneficiaryFieldErrors?.percent_of_beneficiary_interest"
                                  
                                  required
                                  class="mb-1"
                                />
                                <div class="d-flex justify-space-between align-center">
                                  <span class="text-caption text-medium-emphasis">
                                    Remaining: {{ remainingPercentageAvailable }}%
                                  </span>
                                  <v-btn
                                    v-if="remainingPercentageAvailable > 0"
                                    size="small"
                                    variant="text"
                                    color="primary"
                                    density="compact"
                                    class="text-none px-1"
                                    @click="autoFillPercentage"
                                  >
                                    Use remaining
                                  </v-btn>
                                </div>
                              </div>
                            </v-col>
                          </v-row>
                        </div>

                        <p class="text-subtitle-2 font-weight-medium mt-5 mb-3 section-title">
                          Identification
                        </p>

                        <div class="form-section identification-section">
                          <v-row dense>
                            <v-col cols="12" sm="6">
                              <v-select
                                v-model="currentBeneficiaryFormData.id_type"
                                label="ID Type"
                                :items="BENEFICIARY_ID_TYPES" 
                                item-title="title"
                                item-value="value"
                                placeholder="Select ID type"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-card-account-details"
                                                :error="!!(currentBeneficiaryFieldErrors?.id_type)"
                :error-messages="currentBeneficiaryFieldErrors?.id_type"
                                
                                required
                                class="mb-2"
                              />
                            </v-col>

                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="currentBeneficiaryFormData.id_number"
                                label="ID Number"
                                :placeholder="getPlaceholderForIdType(currentBeneficiaryFormData.id_type)"
                                variant="outlined"
                                density="comfortable"
                                bg-color="grey-lighten-5"
                                prepend-inner-icon="mdi-card-account-details"
                                                :error="!!(currentBeneficiaryFieldErrors?.id_number)"
                :error-messages="currentBeneficiaryFieldErrors?.id_number"
                                
                                required
                                class="mb-2"
                              />
                            </v-col>
                          </v-row>
                        </div>
                      </v-card-text>
                    </v-card>

                    <!-- Add Another or Skip Options -->
                    <v-row class="mb-2">
                      <v-col
                        cols="12"
                        class="d-flex flex-column flex-sm-row justify-space-between align-center pa-0 pa-sm-2"
                      >
                        <v-btn
                          v-if="addedBeneficiariesList.length > 0"
                          color="primary"
                          variant="text"
                          class="text-none mb-2 mb-sm-0"
                          prepend-icon="mdi-plus"
                          size="small"
                          @click="handleAddOrUpdateCurrentBeneficiary" 
                        >
                          Add Another Beneficiary
                        </v-btn>
                        <v-btn
                          v-else
                          color="primary"
                          variant="text"
                          class="text-none mb-2 mb-sm-0"
                          prepend-icon="mdi-plus"
                          size="small"
                          @click="handleAddOrUpdateCurrentBeneficiary" 
                        >
                          Add Beneficiary
                        </v-btn>
                        <v-btn
                          color="grey-darken-1"
                          variant="text"
                          class="text-none"
                          size="small"
                          @click="handleSkipBeneficiary"
                        >
                          Skip Adding Beneficiary
                        </v-btn>
                      </v-col>
                    </v-row>

                    <!-- Navigation Buttons -->
                    <v-row>
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          variant="flat"
                          height="44"
                          size="large"
                          class="back-button"
                          prepend-icon="mdi-arrow-left"
                          @click="navigateToPrevious"
                        >
                          Back
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="1" order-sm="2" class="mb-2 mb-sm-0">
                        <v-btn
                          block
                          color="primary"
                          variant="elevated"
                          height="44"
                          size="large"
                          type="submit" 
                          form="v-form" 
                          :loading="onboardingStore.isLoading" 
                          :disabled="onboardingStore.isLoading || (addedBeneficiariesList.length > 0 && totalPercentageAdded !== 100)"
                          class="next-button"
                          append-icon="mdi-arrow-right"
                          @click.prevent="handleSubmitAndProceed"
                        >
                          {{ onboardingStore.isLoading ? 'Processing...' : 'Next' }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <div class="text-center mt-3 pb-3">
          <span class="text-caption text-medium-emphasis d-block mb-1">Powered by</span>
          <v-img
            :src="bigLogo"
            alt="Powered By"
            class="mx-auto logo-image"
            width="120"
            height="40"
            contain
          />
        </div>
      </v-col>

      <!-- Brand Section -->
      <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
        <div class="brand-overlay"></div>
        <v-img src="@/assets/Logo1.png" alt="Cathedral Engage" class="brand-logo" />
      </v-col>
    </v-row>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmRemoveDialog" max-width="400" class="confirm-dialog">
      <v-card class="confirm-card">
        <v-card-title class="text-h5 pt-4">Confirm Removal</v-card-title>
        <v-card-text class="pt-2"> Are you sure you want to remove this beneficiary? </v-card-text>
        <v-card-actions class="pb-3 px-3">
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="flat" @click="confirmRemoveDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="executeRemoveBeneficiary"> Remove </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useBeneficiaryFormManager } from '@/features/onboarding/composables/useBeneficiaryFormManager.js';
import { countryList } from '@/features/onboarding/constants/address-options.js';
import { RELATIONSHIP_OPTIONS, BENEFICIARY_ID_TYPES } from '@/features/onboarding/constants/beneficiary-options.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import FormFieldError from '@/components/ui/FormFieldError.vue';
import { useDemoStore } from '@/store/demoStore';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import {
  useCompleteOnboardingStepper,
  COMPLETE_ONBOARDING_STEPS,
} from '@/composables/useCompleteOnboardingStepper.js';

const router = useRouter();
const onboardingStore = useOnboardingStore();
const demoStore = useDemoStore();

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

const {
  currentBeneficiaryFormData,
  addedBeneficiariesList,
  currentBeneficiaryFieldErrors,
  currentBeneficiaryFormAlert,
  formWideAlert,
  
  resetCurrentBeneficiaryForm,
  addCurrentBeneficiaryToList,
  openConfirmRemoveDialog,
  executeRemoveBeneficiary,
  confirmRemoveDialog,
  totalPercentageAdded,
  remainingPercentageAvailable,
  autoFillPercentage,
  clearPersistedStates,
} = useBeneficiaryFormManager();

const countdown = ref(0);
const showCountdown = ref(false);
const countdownTimer = ref(null);

const startCountdown = () => {
  countdown.value = 30;
  showCountdown.value = true;
  countdownTimer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      showCountdown.value = false;
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
        countdownTimer.value = null;
      }
    }
  }, 1000);
};

const getPlaceholderForIdType = (idType) => {
  switch (idType) {
    case 'National ID':
      return 'Enter 6-11 characters';
    case 'Drivers License':
      return 'Enter 10 alphanumeric characters';
    case 'Passport':
      return 'Enter 8-9 alphanumeric characters';
    default:
      return 'Enter ID number';
  }
};

const handleAddOrUpdateCurrentBeneficiary = async () => {
  const success = await addCurrentBeneficiaryToList();
  if (success) {
    // Optionally show a success message for adding one beneficiary
    // The form resets, list updates from composable
  } else {
    // Errors are handled and displayed by composable/store
  }
};

const handleSkipBeneficiary = async () => {
  try {
    demoStore.setBeneficiarySkipped(true);
    await router.push('/power-of-attorney');
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const navigateToPrevious = () => {
  // The composable handles saving current form state on unmount/navigation
  router.go(-1);
};

// This is the main "Next" button action for the whole page
const handleSubmitAndProceed = async () => {
  formWideAlert.value = null; // Clear previous page-level alerts
  
  // Validate the overall state of beneficiaries (e.g., total percentage)
  if (addedBeneficiariesList.value.length > 0 && totalPercentageAdded.value !== 100) {
    formWideAlert.value = 'Total beneficiary interest must be 100% to proceed.';
    return;
  }
  
  // Save beneficiary data to store
  if (addedBeneficiariesList.value.length > 0) {
    // Save the beneficiaries that have been added
    demoStore.setBeneficiaryData(addedBeneficiariesList.value);
    demoStore.setBeneficiarySkipped(false);
  } else {
    // No beneficiaries added - mark as not skipped but with empty data
    demoStore.setBeneficiaryData([]);
    demoStore.setBeneficiarySkipped(false);
  }

  // Mark current step as complete
  markStepComplete('/designation-of-beneficiary');
  
  // Navigate to power of attorney
  router.push('/power-of-attorney');
};

// Add cleanup for component
onBeforeUnmount(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
});

// Note: The original onMounted to load from store is handled by useBeneficiaryFormManager.
// The original watch for saving to localStorage is handled by useBeneficiaryFormManager.
// The original beforeUnload listener is handled by useBeneficiaryFormManager.
</script>

<style scoped>
/* Stepper styling */
.designation-of-beneficiary-page {
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
  min-height: auto;
  overflow-y: auto;
  position: relative;
}

.form-container {
  max-width: 100%;
  min-height: auto;
  display: flex;
  align-items: flex-start;
  padding: 1.5rem 1.5rem;
}

.form-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 1.5rem;
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
  -webkit-background-clip: text;
  background-clip: text;
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
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

:deep(.v-card) {
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

:deep(.v-list-item) {
  border-radius: 14px;
  margin-bottom: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.7);
}

:deep(.v-list-item:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.12);
}

:deep(.v-avatar) {
  transition: transform 0.3s ease;
}

:deep(.v-list-item:hover .v-avatar) {
  transform: scale(1.05);
}

.text-none {
  text-transform: none !important;
  letter-spacing: 0.25px !important;
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

.brand-logo {
  position: relative;
  z-index: 2;
  width: 200px;
  height: 200px;
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
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

/* Smooth scroll behavior */
.form-section {
  scroll-behavior: smooth;
}

/* Logo image hover effect */
.logo-image {
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

@media (max-width: 959px) {
  .form-container {
    padding: 1.25rem 1rem;
  }

  .brand-section {
    min-height: 220px;
  }

  .brand-logo {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 600px) {
  .form-section {
    height: auto;
    min-height: auto;
  }

  .form-container {
    min-height: auto;
    padding: 1.25rem 1rem;
  }

  .form-card {
    padding: 1rem;
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

  :deep(.v-card-text) {
    padding: 16px !important;
  }

  :deep(.v-text-field .v-field__input) {
    padding-top: 8px;
    padding-bottom: 8px;
    min-height: 48px;
  }

  :deep(.v-list-item) {
    padding: 12px;
    border-radius: 12px;
  }

  .text-subtitle-2 {
    font-size: 0.95rem !important;
  }

  .brand-logo {
    width: 120px;
    height: 120px;
  }
}

/* Form section styles for visual hierarchy */
.form-section {
  padding: 12px;
  border-radius: 14px;
  background-color: rgba(247, 248, 249, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.form-section:hover {
  background-color: rgba(247, 248, 249, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.section-title {
  position: relative;
  padding-left: 12px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
}

.personal-info-section {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.6);
}

.address-section {
  border-left: 3px solid rgba(25, 118, 210, 0.6);
  margin-top: 8px;
  margin-bottom: 8px;
}

.beneficiary-details-section {
  border-left: 3px solid rgba(76, 175, 80, 0.6);
  margin-top: 8px;
  margin-bottom: 8px;
}

.identification-section {
  border-left: 3px solid rgba(255, 152, 0, 0.6);
  margin-top: 8px;
}

/* Beneficiary list animations */
.beneficiary-list {
  transition: all 0.3s ease;
}

.beneficiary-item {
  animation: fadeIn 0.4s ease-out;
  transform-origin: center top;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Confirmation dialog styling */
.confirm-dialog :deep(.v-card) {
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.confirm-card {
  text-align: center;
  padding: 8px;
}

.confirm-dialog :deep(.v-btn) {
  min-width: 100px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.25px;
  text-transform: none;
}

/* Add consistent spacing to form groups */
:deep(.v-row) {
  margin-bottom: 8px;
}

:deep(.v-text-field) {
  margin-bottom: 8px;
}

:deep(.v-select) {
  margin-bottom: 8px;
}

:deep(.v-card-text) {
  padding: 16px !important;
}

/* Add styles for percentage indicator */
.percentage-chip {
  font-weight: 600;
  transition: all 0.3s ease;
}
</style> 