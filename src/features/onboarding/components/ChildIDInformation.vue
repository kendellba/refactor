<template>
  <div class="child-id-information-page">
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
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Child ID Information</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Please provide the child's identification details
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-form @submit.prevent="handleSubmit">
                    <!-- Error Alert -->
                    <v-alert v-if="onboardingStore.apiSubmitError || formAlertError" type="error" variant="tonal" class="mb-4" density="compact">
                      {{ onboardingStore.apiSubmitError || formAlertError }}
                    </v-alert>

                    <!-- Child's First Form of ID -->
                    <v-card class="mb-6" variant="outlined">
                      <v-card-text>
                        <h3 class="text-h6 mb-4">Child's First Form of ID</h3>
                        <v-select
                          v-model="formData.firstIdType"
                          label="Type of ID"
                          :items="ID_TYPES"
                          item-title="title"
                          item-value="value"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-card-account-details"
                          :error="!!fieldErrors.firstIdType"
                          @update:model-value="() => validateFormField('firstIdType')"
                          @blur="() => validateFormField('firstIdType')"
                        >
                          <template v-if="fieldErrors.firstIdType" #details>
                            <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.firstIdType }}
                            </div>
                          </template>
                        </v-select>

                        <v-text-field
                          v-model="formData.firstIdNumber"
                          label="ID Number"
                          :placeholder="getPlaceholderForIdType(formData.firstIdType)"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-pound"
                          :error="!!fieldErrors.firstIdNumber"
                          @input="() => validateFormField('firstIdNumber')"
                          @blur="() => validateFormField('firstIdNumber')"
                        >
                           <template v-if="fieldErrors.firstIdNumber" #details>
                             <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.firstIdNumber }}
                            </div>
                          </template>
                        </v-text-field>

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
                          :error="!!fieldErrors.firstExpiryDate"
                          :disabled="formData.firstIdType === 'Birth Certificate'"
                          @input="() => validateFormField('firstExpiryDate')"
                          @blur="() => validateFormField('firstExpiryDate')"
                        >
                          <template v-if="fieldErrors.firstExpiryDate" #details>
                            <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.firstExpiryDate }}
                            </div>
                          </template>
                        </v-text-field>

                        <v-file-input
                          v-model="formData.firstIdDocument"
                          label="Upload First ID"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          counter
                          chips
                          show-size
                          multiple
                          clearable
                          hint="Max 5 files, 20MB each. PDF, JPG, PNG."
                          persistent-hint
                          class="mt-3"
                          :error="!!fieldErrors.firstIdDocument"
                          @update:model-value="() => validateFormField('firstIdDocument')"
                          @blur="() => validateFormField('firstIdDocument')"
                        >
                          <template v-if="fieldErrors.firstIdDocument" #details>
                            <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.firstIdDocument }}
                            </div>
                          </template>
                        </v-file-input>
                        <v-alert
                          v-if="previouslyUploadedFileNames.first"
                          type="info"
                          variant="tonal"
                          density="compact"
                          class="mt-2 text-caption"
                        >
                          Previously uploaded: {{ previouslyUploadedFileNames.first }}
                        </v-alert>
                      </v-card-text>
                    </v-card>

                    <div class="d-flex align-center mb-4">
                      <v-checkbox
                        v-model="formData.hasSecondId"
                        label="I have a second form of ID for the child"
                        hide-details
                        density="compact"
                        class="mb-2"
                        @update:model-value="() => validateFormField('hasSecondId')"
                      ></v-checkbox>
                    </div>

                    <v-card v-if="formData.hasSecondId" class="mb-6" variant="outlined">
                      <v-card-text>
                        <h3 class="text-h6 mb-4">Child's Second Form of ID</h3>
                        <v-select
                          v-model="formData.secondIdType"
                          label="Type of ID"
                          :items="availableSecondIdTypes"
                          item-title="title"
                          item-value="value"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-card-account-details"
                          :error="!!fieldErrors.secondIdType"
                           @update:model-value="() => validateFormField('secondIdType')"
                           @blur="() => validateFormField('secondIdType')"
                        >
                          <template v-if="fieldErrors.secondIdType" #details>
                            <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.secondIdType }}
                            </div>
                          </template>
                        </v-select>

                        <v-text-field
                          v-model="formData.secondIdNumber"
                          label="ID Number"
                          :placeholder="getPlaceholderForIdType(formData.secondIdType)"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-pound"
                          :error="!!fieldErrors.secondIdNumber"
                          @input="() => validateFormField('secondIdNumber')"
                          @blur="() => validateFormField('secondIdNumber')"
                        >
                          <template v-if="fieldErrors.secondIdNumber" #details>
                            <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.secondIdNumber }}
                            </div>
                          </template>
                        </v-text-field>

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
                          :error="!!fieldErrors.secondExpiryDate"
                          :disabled="formData.secondIdType === 'Birth Certificate'"
                          @input="() => validateFormField('secondExpiryDate')"
                          @blur="() => validateFormField('secondExpiryDate')"
                        >
                          <template v-if="fieldErrors.secondExpiryDate" #details>
                            <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.secondExpiryDate }}
                            </div>
                          </template>
                        </v-text-field>

                        <v-file-input
                          v-model="formData.secondIdDocument"
                          label="Upload Second ID"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          counter
                          chips
                          show-size
                          multiple
                          clearable
                          hint="Max 5 files, 20MB each. PDF, JPG, PNG."
                          persistent-hint
                          class="mt-3"
                          :error="!!fieldErrors.secondIdDocument"
                          @update:model-value="() => validateFormField('secondIdDocument')"
                          @blur="() => validateFormField('secondIdDocument')"
                        >
                          <template v-if="fieldErrors.secondIdDocument" #details>
                            <div class="custom-error-message pa-1 text-caption text-error">
                                <v-icon size="small" color="error" class="mr-1">mdi-alert-circle</v-icon>
                                {{ fieldErrors.secondIdDocument }}
                            </div>
                          </template>
                        </v-file-input>
                         <v-alert
                          v-if="previouslyUploadedFileNames.second"
                          type="info"
                          variant="tonal"
                          density="compact"
                          class="mt-2 text-caption"
                        >
                          Previously uploaded: {{ previouslyUploadedFileNames.second }}
                        </v-alert>
                      </v-card-text>
                    </v-card>

                    <v-divider class="my-6"></v-divider>

                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          size="large"
                          height="50"
                          variant="flat"
                          :disabled="onboardingStore.isLoading"
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

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useChildIdFormManager } from '@/features/onboarding/composables/useChildIdFormManager.js';
import { ID_TYPES } from '@/features/onboarding/constants/id-options.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import {
  useCompleteOnboardingStepper,
  COMPLETE_ONBOARDING_STEPS,
} from '@/composables/useCompleteOnboardingStepper.js';

const router = useRouter();
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

const {
  formData,
  fieldErrors,
  formAlertError,
  previouslyUploadedFileNames,
  validate,
  validateFormField,
  clearErrors,
  clearPersistedFormState
} = useChildIdFormManager();

const minDate = computed(() => new Date().toISOString().split('T')[0]);
const maxExpiryDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 10);
  return date.toISOString().split('T')[0];
});

const availableSecondIdTypes = computed(() => {
  return ID_TYPES.filter(type => type.value !== formData.value.firstIdType);
});

const getPlaceholderForIdType = (idType) => {
  switch (idType) {
    case 'National ID':
      return 'Enter 6-11 digit ID number';
    case 'Passport':
      return 'Enter 8-9 alphanumeric characters';
    case 'Birth Certificate':
      return 'Enter up to 20 alphanumeric characters';
    default:
      return 'Enter ID number';
  }
};

const handleSubmit = async () => {
  clearErrors(); // Clear previous errors before new validation
  const validationResult = await validate(formData.value);

  if (!validationResult.isValid) {
    // fieldErrors are automatically populated by validate() from useSimpleFormValidation
    // Set a general alert if there are field errors and no specific API alert is already showing.
    if (Object.keys(fieldErrors.value).length > 0 && !formAlertError.value) {
      formAlertError.value = 'Please correct the highlighted errors.';
    }
    return;
  }

  const storeSubmissionResult = await onboardingStore.submitChildIdData(formData.value);

  if (storeSubmissionResult.success) {
    // Mark current step as complete
    markStepComplete();
    clearPersistedFormState(); // Clear localStorage and form state
    router.push('/parent-guardian-information'); // Navigate to the next step
  } else {
    // Populate fieldErrors and formAlertError from store action's response
    if (storeSubmissionResult.fieldMessages) {
      fieldErrors.value = { ...fieldErrors.value, ...storeSubmissionResult.fieldMessages };
    }
    if (storeSubmissionResult.generalMessage) {
      formAlertError.value = storeSubmissionResult.generalMessage;
    } else if (!Object.keys(storeSubmissionResult.fieldMessages || {}).length && !storeSubmissionResult.generalMessage) {
      // Fallback generic error if no specific messages from API/store
      formAlertError.value = 'An unexpected error occurred during submission.';
    }
  }
};

const navigateToPrevious = () => {
  router.go(-1);
};

// All old local state, computed properties, watchers, and methods related to form handling,
// validation logic (e.g., validateIdNumber, validateExpiryDate, formatDate, validateFileUpload, validateForm, createIdFormData, submitId, saveToStore),
// and direct localStorage interactions have been removed.
// Lifecycle hooks (onMounted, onBeforeUnmount) for persistence and specific field/interaction watchers
// (e.g., for ID type changes influencing expiry dates, or hasSecondId toggling fields) are now handled by useChildIdFormManager.
</script>

<style scoped>
/* Styles are copied from the original ChildIDInformation.vue, ensure they are still relevant */
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

:deep(.v-card) { /* For inner cards styling */
  border-radius: 8px !important;
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

.custom-error-message { 
  font-size: 0.75rem; 
  padding-top: 2px;
  display: flex;
  align-items: center;
}

@media (max-width: 959px) {
  .form-container {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
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