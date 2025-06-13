<template>
  <div class="politically-exposed-persons-page">
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
                    Politically Exposed Persons
                  </h1>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    Please provide information about any political exposure
                  </p>
                </div>

                <v-card class="form-card" elevation="0" rounded="lg">
                  <v-card-text>
                    <v-form @submit.prevent="handleSubmit">
                      <v-alert
                        v-if="onboardingStore.apiSubmitError"
                        type="error"
                        variant="tonal"
                        class="mb-4"
                      >
                        {{ onboardingStore.apiSubmitError }}
                      </v-alert>
                      <v-alert
                        v-if="formManager.serverError.value"
                        type="error"
                        variant="tonal"
                        class="mb-4"
                      >
                        {{ formManager.serverError.value }}
                      </v-alert>

                      <!-- PEP Status Section -->
                      <v-card class="mb-6" variant="outlined">
                        <v-card-text>
                          <p class="text-body-1 mb-4">
                            A Politically Exposed Person (PEP) is someone who has been entrusted
                            with a prominent public function, or an immediate family member or close
                            associate of such a person.
                          </p>

                          <v-radio-group
                            v-model="formManager.formData.value.isPEP"
                            label="Are you a politically exposed person, or related to one?"
                            :error-messages="formManager.fieldErrors.value.isPEP"
                            class="mb-4"
                            @change="formManager.validateField('isPEP')"
                          >
                            <v-radio label="Yes" :value="true" />
                            <v-radio label="No" :value="false" />
                          </v-radio-group>

                          <template v-if="formManager.formData.value.isPEP === true">
                            <v-select
                              v-model="formManager.formData.value.domestic_foreign_roles"
                              label="Position/Office (Domestic or Foreign roles)"
                              :items="pepPositions"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-briefcase"
                              multiple
                              chips
                              closable-chips
                              item-title="title"
                              item-value="value"
                              :error-messages="formManager.fieldErrors.value.domestic_foreign_roles"
                              class="mb-4"
                              @blur="formManager.validateField('domestic_foreign_roles')"
                            />

                            <v-select
                              v-model="formManager.formData.value.immediate_family_members"
                              label="Immediate Family Member of PEP"
                              :items="pepRelationships"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account-group"
                              multiple
                              chips
                              closable-chips
                              item-title="title"
                              item-value="value"
                              :error-messages="
                                formManager.fieldErrors.value.immediate_family_members
                              "
                              class="mb-4"
                              @blur="formManager.validateField('immediate_family_members')"
                            />

                            <v-select
                              v-model="formManager.formData.value.international_roles"
                              label="International Organization PEP"
                              :items="internationalOrganizations"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-earth"
                              multiple
                              chips
                              closable-chips
                              item-title="title"
                              item-value="value"
                              :error-messages="formManager.fieldErrors.value.international_roles"
                              class="mb-4"
                              @blur="formManager.validateField('international_roles')"
                            />

                            <v-text-field
                              v-model="formManager.formData.value.jobTitle"
                              label="Job Title"
                              placeholder="Enter your job title"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-card-account-details"
                              :error-messages="formManager.fieldErrors.value.jobTitle"
                              class="mb-4"
                              @blur="formManager.validateField('jobTitle')"
                            />
                          </template>
                        </v-card-text>
                      </v-card>

                      <!-- PEP Association Section -->
                      <v-card class="mb-6" variant="outlined">
                        <v-card-text>
                          <label class="text-subtitle-1 mb-2 d-block"
                            >Are you an associate of a politically exposed person?</label
                          >
                          <v-radio-group
                            v-model="formManager.formData.value.is_close_associate"
                            :error-messages="formManager.fieldErrors.value.is_close_associate"
                            class="mb-2"
                            inline
                            @change="formManager.validateField('is_close_associate')"
                          >
                            <v-radio label="Yes" value="yes" />
                            <v-radio label="No" value="no" />
                          </v-radio-group>

                          <template v-if="formManager.formData.value.is_close_associate === 'yes'">
                            <v-text-field
                              v-model="formManager.formData.value.relationship_type"
                              label="Relationship to PEP"
                              placeholder="Enter relationship"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account-heart"
                              :error-messages="formManager.fieldErrors.value.relationship_type"
                              class="mb-4"
                              @blur="formManager.validateField('relationship_type')"
                            />

                            <v-text-field
                              v-model="formManager.formData.value.associate_name"
                              label="Name of Associated PEP"
                              placeholder="Enter name of PEP"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account"
                              :error-messages="formManager.fieldErrors.value.associate_name"
                              class="mb-4"
                              @blur="formManager.validateField('associate_name')"
                            />
                          </template>
                        </v-card-text>
                      </v-card>

                      <v-row class="mt-6">
                        <v-col cols="12" sm="6" order="2" order-sm="1">
                          <v-btn
                            block
                            color="secondary"
                            variant="flat"
                            size="large"
                            height="44"
                            :disabled="onboardingStore.isLoading"
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
                            type="submit"
                            :loading="onboardingStore.isLoading"
                            append-icon="mdi-arrow-right"
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
          <v-img src="@/assets/Logo1.png" alt="Cathedral Engage" class="brand-logo" contain />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { usePepFormManager } from '@/features/onboarding/composables/usePepFormManager.js';
import {
  pepPositions,
  pepRelationships,
  internationalOrganizations,
} from '@/features/onboarding/constants/pep-options.js';
import { useDemoStore } from '@/store/demoStore'; // For DOB to calculate age
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import { useLoadingState } from '@/shared/composables/useLoadingState';
import { useNotifications } from '@/shared/composables/useNotifications';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import {
  useCompleteOnboardingStepper,
  COMPLETE_ONBOARDING_STEPS,
} from '@/composables/useCompleteOnboardingStepper.js';

const router = useRouter();
const onboardingStore = useOnboardingStore();
const formManager = usePepFormManager();
const demoStore = useDemoStore();

// Initialize loading state with 2 steps (validation and submission)
const loadingState = useLoadingState({
  progressSteps: 2,
  showProgress: true,
});

// Initialize notifications
const notifications = useNotifications();

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

const handleSubmit = async () => {
  formManager.clearErrors();
  onboardingStore.apiSubmitError = null;
  onboardingStore.apiFieldErrors = {};

  // Start loading with initial message
  loadingState.startLoading('Validating form...');

  const validationResult = await formManager.validate(formManager.formData.value);
  if (!validationResult.isValid) {
    loadingState.errorLoading('Please correct the form errors');
    notifications.error('Please correct the form errors');
    return;
  }

  // Update loading state for submission
  loadingState.updateProgress(1, 'Submitting PEP information...');

  const result = await onboardingStore.submitPepDataAction(formManager.formData.value);

  if (result.success) {
    // Mark current step as complete
    markStepComplete('/politically-exposed-persons');

    loadingState.completeLoading();
    notifications.success('PEP information submitted successfully');

    const age = demoStore.getAge;

    // Navigate based on age
    if (!demoStore.getDob) {
      // Fallback: if DOB is missing, redirect to basic info
      notifications.warning(
        'Date of birth information is missing. Please complete basic information first.'
      );
      router.push('/basic-info');
      return;
    }

    if (age < 18) {
      router.push('/child-id-information');
    } else {
      router.push('/id-information');
    }
  } else {
    loadingState.errorLoading(result.generalMessage);
    notifications.error(result.generalMessage);

    if (result.fieldMessages) {
      for (const key in result.fieldMessages) {
        if (Object.hasOwnProperty.call(formManager.fieldErrors.value, key)) {
          formManager.fieldErrors.value[key] = result.fieldMessages[key];
        } else {
          if (!onboardingStore.apiSubmitError && result.fieldMessages[key]) {
            onboardingStore.apiSubmitError =
              (onboardingStore.apiSubmitError ? onboardingStore.apiSubmitError + '; ' : '') +
              result.fieldMessages[key];
          }
        }
      }
    }
    if (
      result.generalMessage &&
      !onboardingStore.apiSubmitError &&
      !Object.keys(formManager.fieldErrors.value).some((k) => formManager.fieldErrors.value[k])
    ) {
      onboardingStore.apiSubmitError = result.generalMessage;
    }
  }
};

const navigateToPrevious = () => {
  // Show confirmation if form has unsaved changes
  if (formManager.isDirty) {
    notifications.warning('You have unsaved changes', {
      action: () => {
        router.push('/membership-declaration-agreement');
      },
      actionText: 'Discard Changes',
    });
  } else {
    router.push('/membership-declaration-agreement');
  }
};

onMounted(() => {
  if (!demoStore.signupId) {
    router.push('/basic-info'); // Redirect if signup process hasn't started
    return;
  }
  formManager.loadPersistedData(); // Load data from demoStore.pepInfo or localStorage
  onboardingStore.apiSubmitError = null; // Clear any stale API errors
  onboardingStore.apiFieldErrors = {};
  formManager.clearErrors(); // Clear Zod errors
});

// Watch for API field errors from the store and update formManager's errors
// This helps if errors are set in the store by some other means or need reactive updates
watch(
  () => onboardingStore.apiFieldErrors,
  (newErrors) => {
    if (newErrors && Object.keys(newErrors).length > 0) {
      let updated = false;
      for (const key in newErrors) {
        if (formManager.fieldErrors.value[key] !== newErrors[key]) {
          formManager.fieldErrors.value[key] = newErrors[key];
          updated = true;
        }
      }
      // Clear fields in formManager.fieldErrors that are no longer in store's apiFieldErrors
      for (const key in formManager.fieldErrors.value) {
        if (formManager.fieldErrors.value[key] && !newErrors[key] && API_FIELD_MAPPING_PEP[key]) {
          // Check if it was an API mapped field
          delete formManager.fieldErrors.value[key];
          updated = true;
        }
      }
      if (updated) {
        formManager.fieldErrors.value = { ...formManager.fieldErrors.value }; // Trigger reactivity
      }
    }
  },
  { deep: true }
);

// Clear server/API errors when form data changes by user interaction
watch(
  formManager.formData,
  () => {
    if (onboardingStore.apiSubmitError) {
      onboardingStore.apiSubmitError = null;
    }
    // Clearing specific formManager.fieldErrors here could be too aggressive
    // if they came from a Zod validation. Zod errors should be cleared on successful re-validation.
    // However, if API field errors were mapped, they could be cleared as user types in that field.
  },
  { deep: true }
);

// Constants for API field mapping - for the watcher if needed
const API_FIELD_MAPPING_PEP = {
  is_pep: 'isPEP',
  job_title: 'jobTitle',
  domestic_foreign_roles: 'domestic_foreign_roles',
  international_roles: 'international_roles',
  immediate_family_members: 'immediate_family_members',
  is_close_associate: 'is_close_associate',
  relationship_type: 'relationship_type',
  associate_name: 'associate_name',
};
</script>

<style scoped>
/* Stepper styling */
.politically-exposed-persons-page {
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
  background: linear-gradient(to bottom, #ffffff, #f8f9fa); /* Light gradient background */
  min-height: 100vh; /* Full height */
  overflow-y: auto; /* Allow scrolling for content */
}

.form-container {
  max-width: 100%; /* Ensure it doesn't overflow small screens */
  min-height: 100vh; /* Full height */
  display: flex;
  align-items: center; /* Vertically center content */
  padding-top: 2rem; /* Padding top */
  padding-bottom: 2rem; /* Padding bottom */
  padding-left: 1.5rem; /* Horizontal padding */
  padding-right: 1.5rem; /* Horizontal padding */
}

.form-card {
  border-radius: 24px; /* Rounded corners for the card */
  background-color: white; /* Card background */
  padding: 2.5rem; /* Padding inside the card */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06); /* Soft shadow */
  width: 100%;
}

.primary-text {
  color: var(--v-primary-base); /* Use Vuetify primary color */
  font-size: 2.25rem; /* Slightly larger header text */
  letter-spacing: -0.5px; /* Adjust letter spacing */
  line-height: 1.2; /* Adjust line height */
  font-weight: 700; /* Bold font weight */
  /* Gradient text effect */
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem; /* Space below header */
}

:deep(.v-btn) {
  height: 54px !important; /* Standard button height */
  border-radius: 14px !important; /* Rounded buttons */
  font-weight: 600; /* Button text font weight */
  letter-spacing: 0.25px; /* Button text letter spacing */
  text-transform: none; /* No uppercase transform */
}

:deep(.v-select .v-chip) {
  background-color: var(--v-primary-lighten2) !important;
  color: var(--v-primary-darken2) !important;
  font-weight: 500;
}

:deep(.v-radio-group .v-label) {
  opacity: 1; /* Ensure Vuetify 3 label opacity is full */
}

.v-radio-group {
  margin-bottom: 1rem; /* Adjusted spacing */
}
.v-radio-group > .v-label {
  /* Target the group's label directly if Vuetify structure is specific */
  margin-bottom: 0.5rem; /* Space below the question */
  font-size: 1rem; /* Ensure consistent label size */
  color: rgba(0, 0, 0, 0.87); /* Default text color */
  display: block; /* Ensure it takes full width for spacing */
}

:deep(.v-field) {
  border-radius: 14px !important; /* Rounded input fields */
  box-shadow: none !important; /* No shadow on input fields */
  background: rgba(247, 248, 249, 0.7) !important; /* Light background for inputs */
}

/* Brand Section Styling */

.brand-image {
  max-width: 100%;
  max-height: 60vh; /* Adjust as needed */
  object-fit: contain; /* Ensure image scales nicely */
  margin-bottom: 2rem; /* Space below image */
  z-index: 1;
}

.brand-text {
  z-index: 1; /* Ensure text is above overlay */
  text-align: center;
}

.logo-image {
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
}

@media (max-width: 959px) {
  /* md breakpoint */
  .form-container {
    padding: 2rem 1.25rem; /* Adjust padding for smaller screens */
  }
  .brand-section {
    padding: 2rem;
  }
}

@media (max-width: 600px) {
  /* sm breakpoint */
  .form-section {
    height: auto; /* Auto height for form on small screens */
    min-height: 100vh; /* Still ensure it takes at least full viewport */
  }
  .form-container {
    min-height: auto; /* Auto min-height */
    padding: 1.75rem 1rem; /* Further adjust padding */
  }
  .form-card {
    padding: 1.75rem; /* Adjust card padding */
    border-radius: 20px; /* Slightly less rounded corners */
  }
  .primary-text {
    font-size: 2rem; /* Smaller header text */
  }
  :deep(.v-btn) {
    height: 50px !important; /* Adjust button height */
    border-radius: 12px !important; /* Adjust button radius */
  }
  .brand-text h2 {
    font-size: 1.75rem;
  }
  .brand-text p {
    font-size: 1rem;
  }
}
</style>
