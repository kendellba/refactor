<template>
  <div class="employment-information-page">
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
                  <h1 class="text-h5 font-weight-bold primary-text mb-1">Employment Information</h1>
                  <p class="text-subtitle-2 text-medium-emphasis">
                    Please provide your employment details
                  </p>
                </div>

                <v-card class="form-card" elevation="0" rounded="lg">
                  <v-card-text>
                    <v-form @submit.prevent="handleSubmit">
                      <!-- Error Alert -->
                      <v-alert
                        v-if="onboardingStore.apiSubmitError || formAlertError"
                        type="error"
                        variant="tonal"
                        class="mb-3"
                        density="compact"
                      >
                        {{ onboardingStore.apiSubmitError || formAlertError }}
                      </v-alert>

                      <v-card class="mb-3" variant="outlined">
                        <v-card-text class="pa-3">
                          <!-- Employment Status Section -->
                          <p class="text-subtitle-2 font-weight-medium mb-2 section-title">
                            Employment Status
                          </p>

                          <!-- Child Account Section (if applicable) -->
                          <div v-if="isChild" class="form-section child-account-section">
                            <v-alert type="info" variant="tonal" class="mb-3">
                              <strong>Child Account Detected</strong><br />
                              Additional fields are required for child accounts.
                            </v-alert>
                          </div>

                          <div class="form-section employment-status-section">
                            <v-switch
                              v-model="formData.is_business_owner"
                              label="I am a business owner"
                              color="primary"
                              hide-details
                              class="mb-4"
                            ></v-switch>

                            <v-select
                              v-model="formData.employment_status"
                              :items="displayEmploymentOptions"
                              label="Employment Status"
                              item-title="title"
                              item-value="value"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-briefcase"
                              required
                              :error-messages="getFieldError('employment_status')"
                              class="mb-4"
                            />

                            <!-- Employment Details Section -->
                            <v-text-field
                              v-model="formData.employer_name"
                              label="Employer/Business Name"
                              placeholder="Enter your employer/business name"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-domain"
                              required
                              :error-messages="getFieldError('employer_name')"
                              clearable
                              class="mb-3"
                            />

                            <v-autocomplete
                              v-model="formData.occupation"
                              :items="occupations"
                              label="Occupation"
                              placeholder="Start typing your occupation"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account-tie"
                              required
                              :error-messages="getFieldError('occupation')"
                              clearable
                              auto-select-first
                              hide-no-data
                              class="mb-3"
                            />

                            <v-text-field
                              v-if="formData.occupation === 'Other'"
                              v-model="formData.custom_occupation"
                              label="Specify Your Occupation"
                              placeholder="Enter your occupation"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account-tie"
                              required
                              :error-messages="getFieldError('custom_occupation')"
                              class="mb-3"
                            />

                            <v-autocomplete
                              v-if="formData.is_business_owner === true"
                              v-model="formData.business_type"
                              :items="businessTypes"
                              label="Type of Business"
                              placeholder="Start typing your business type"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-store"
                              required
                              :error-messages="getFieldError('business_type')"
                              clearable
                              auto-select-first
                              hide-no-data
                              class="mb-3"
                            />
                          </div>

                          <p class="text-subtitle-2 font-weight-medium mt-5 mb-3 section-title">
                            Contact Information
                          </p>

                          <div class="form-section contact-section">
                            <v-text-field
                              v-model="formData.work_phone"
                              label="Work Phone"
                              placeholder="Enter your work/business phone number"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-phone"
                              :error-messages="getFieldError('work_phone')"
                              class="mb-3"
                            />

                            <v-text-field
                              v-model="formData.address_line_1"
                              label="Address Line 1"
                              placeholder="Enter your work/business address"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-map-marker"
                              required
                              :error-messages="getFieldError('address_line_1')"
                              class="mb-3"
                            />

                            <v-text-field
                              v-model="formData.address_line_2"
                              label="Address Line 2"
                              placeholder="Apartment, suite, etc. (optional)"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-map-marker-plus"
                              :error-messages="getFieldError('address_line_2')"
                              class="mb-3"
                            />

                            <v-text-field
                              v-model="formData.city"
                              label="City"
                              placeholder="Enter city"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-city"
                              required
                              :error-messages="getFieldError('city')"
                              class="mb-3"
                            />

                            <v-autocomplete
                              v-model="formData.country"
                              :items="countryList"
                              item-title="title"
                              item-value="value"
                              label="Country"
                              placeholder="Start typing your country"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-earth"
                              required
                              :error-messages="getFieldError('country')"
                              clearable
                              auto-select-first
                              hide-no-data
                              class="mb-3"
                            />
                          </div>

                          <p class="text-subtitle-2 font-weight-medium mt-5 mb-3 section-title">
                            Additional Information
                          </p>

                          <div class="form-section additional-info-section">
                            <v-row dense>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="formData.nis_number"
                                  label="NIS Number"
                                  placeholder="Enter your NIS number"
                                  variant="outlined"
                                  density="comfortable"
                                  bg-color="grey-lighten-5"
                                  prepend-inner-icon="mdi-card-account-details"
                                  :error-messages="getFieldError('nis_number')"
                                  class="mb-3"
                                />
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="formData.bir_number"
                                  label="BIR Number"
                                  placeholder="Enter your BIR number"
                                  variant="outlined"
                                  density="comfortable"
                                  bg-color="grey-lighten-5"
                                  prepend-inner-icon="mdi-identifier"
                                  :error-messages="getFieldError('bir_number')"
                                  class="mb-3"
                                />
                              </v-col>
                            </v-row>

                            <v-select
                              v-model="formData.monthly_remuneration"
                              :items="remunerationOptions"
                              label="Monthly Remuneration"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-cash"
                              required
                              :error-messages="getFieldError('monthly_remuneration')"
                              class="mb-3"
                            />

                            <v-select
                              v-model="formData.value_of_assets"
                              :items="assetValueOptions"
                              label="Value of Assets"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-bank"
                              required
                              :error-messages="getFieldError('value_of_assets')"
                              class="mb-3"
                            />
                          </div>

                          <!-- Child Account Section (if applicable) -->
                          <div v-if="isChild" class="form-section child-account-section">
                            <p class="text-subtitle-2 font-weight-medium mt-5 mb-3 section-title">
                              Child Account Details
                            </p>

                            <v-select
                              v-model="formData.child_account_contribution"
                              :items="childContributionOptions"
                              label="Child Account Contribution"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account-child"
                              :required="isChild"
                              :error-messages="getFieldError('child_account_contribution')"
                              class="mb-3"
                            />

                            <v-text-field
                              v-model="formData.child_account_contribution_amount"
                              label="Child Account Contribution Amount"
                              placeholder="Enter contribution amount"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-cash"
                              type="number"
                              :required="isChild"
                              :error-messages="getFieldError('child_account_contribution_amount')"
                              class="mb-3"
                            />
                          </div>

                          <p class="text-subtitle-2 font-weight-medium mt-5 mb-3 section-title">
                            Source of Funds
                          </p>

                          <div class="form-section source-of-funds-section">
                            <v-select
                              v-model="formData.source_of_funds_type"
                              :items="sourceOfFundsOptions"
                              label="Source of Funds"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-file-document"
                              required
                              :error-messages="getFieldError('source_of_funds_type')"
                              class="mb-3"
                            />

                            <v-file-input
                              :key="formKey"
                              :model-value="formData.proof_of_employment_files"
                              :label="
                                formData.employment_status &&
                                formData.employment_status.toLowerCase()
                                  ? 'Proof of Employment'
                                  : 'Upload Document'
                              "
                              :placeholder="
                                formData.employment_status &&
                                formData.employment_status.toLowerCase()
                                  ? 'Upload proof of employment'
                                  : 'Upload document'
                              "
                              variant="outlined"
                              density="comfortable"
                              chips
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-file-document"
                              accept="image/*, application/pdf"
                              @update:model-value="handleFileUpload"
                              required
                              show-size
                              counter
                              multiple
                              :error-messages="getFieldError('proof_of_employment_files')"
                              hint="Please upload clear copies of your proof of employment (max 20MB each)"
                              persistent-hint
                            />
                          </div>
                        </v-card-text>
                      </v-card>

                      <!-- Navigation Buttons -->
                      <v-row>
                        <v-col cols="12" sm="6" order="2" order-sm="1">
                          <v-btn
                            block
                            color="secondary"
                            variant="flat"
                            :disabled="isLoading"
                            height="44"
                            size="large"
                            class="back-button"
                            prepend-icon="mdi-arrow-left"
                            @click="navigateToPrevious"
                          >
                            Back
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" order="1" order-sm="2" class="mb-3 mb-sm-0">
                          <v-btn
                            block
                            color="primary"
                            variant="flat"
                            type="submit"
                            :loading="isLoading.value"
                            height="44"
                            size="large"
                            class="next-button"
                            append-icon="mdi-arrow-right"
                          >
                            {{ isLoading.value ? 'Processing...' : 'Next' }}
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
    </v-container>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEmploymentFormManager } from '@/features/onboarding/composables/useEmploymentFormManager.js';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useHolderType } from '@/composables/useHolderType';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import FormFieldError from '@/components/ui/FormFieldError.vue';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import {
  useCompleteOnboardingStepper,
  COMPLETE_ONBOARDING_STEPS,
} from '@/composables/useCompleteOnboardingStepper.js';

const router = useRouter();
const onboardingStore = useOnboardingStore();

// Initialize stepper for progress tracking
const { completedSteps, currentStepNumber, markStepComplete, navigateToStep } =
  useCompleteOnboardingStepper();

// Stepper event handlers
const handleStepChange = ({ step }) => {
  console.log('Step changed:', step.title);
};

const handleStepClick = ({ step }) => {
  navigateToStep(step.route);
};

const { isChild } = useHolderType();

const {
  formData,
  errors: fieldErrors,
  serverErrors,
  formSubmitError: formAlertError,
  isLoading,
  handleSubmit: originalHandleSubmit,
  handleFileUpload,
  formKey,
  countryList,
  occupations,
  businessTypes,
  displayEmploymentOptions,
  remunerationOptions,
  assetValueOptions,
  childContributionOptions,
  sourceOfFundsOptions,
  parseAndSetApiErrors,
} = useEmploymentFormManager(isChild);

// Wrap the handleSubmit to mark step complete
const handleSubmit = async () => {
  const result = await originalHandleSubmit();
  // If submission was successful, mark step complete
  if (result === true || (!formAlertError.value && !Object.keys(fieldErrors.value || {}).length)) {
    markStepComplete('/employment-information');
  }
  return result;
};

const navigateToPrevious = () => {
  router.go(-1);
};

const getFieldError = (fieldName) => {
  // Defensive function to get field errors with proper null checking
  const clientError = fieldErrors?.value?.[fieldName];
  const serverError = serverErrors?.value?.[fieldName];

  // Return the first available error (server errors take priority)
  return serverError || clientError || null;
};
</script>

<style scoped>
/* Stepper styling */
.employment-information-page {
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

:deep(.v-alert) {
  border-radius: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(var(--v-theme-error), 0.08) !important;
  border: 1px solid rgba(var(--v-theme-error), 0.1) !important;
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

.employment-status-section {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.6);
}

.contact-section {
  border-left: 3px solid rgba(25, 118, 210, 0.6);
  margin-top: 8px;
  margin-bottom: 8px;
}

.additional-info-section {
  border-left: 3px solid rgba(255, 152, 0, 0.6);
  margin-top: 8px;
  margin-bottom: 8px;
}

.child-account-section {
  border-left: 3px solid rgba(76, 175, 80, 0.6);
  margin-top: 8px;
  margin-bottom: 8px;
}

.source-of-funds-section {
  border-left: 3px solid rgba(156, 39, 176, 0.6);
  margin-top: 8px;
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

  .text-subtitle-2 {
    font-size: 0.95rem !important;
  }

  .brand-logo {
    width: 120px;
    height: 120px;
  }
}
</style>
