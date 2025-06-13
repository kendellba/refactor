basic info

<template>
  <div class="basic-info-page">
    <!-- Onboarding Stepper -->
    <div class="stepper-container">
      <v-container>
        <SimpleStepper
          :steps="BASIC_ONBOARDING_STEPS"
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
                <div class="mx-auto mb-4 logo-wrapper">
                  <img :src="logoImage" alt="Cathedral Engage" class="logo-img" />
                </div>
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Basic Information</h1>
                <p class="text-subtitle-1 text-medium-emphasis mobile-small-text">
                  Please enter your personal details to get started
                </p>
              </div>

              <v-card class="form-card mobile-reduced-padding" elevation="0" rounded="lg">
                <v-card-text>
                  <v-form @submit.prevent="handleSubmit">
                    <v-alert
                      v-if="formAlertError"
                      type="error"
                      variant="tonal"
                      class="mb-6"
                      rounded="lg"
                      elevation="2"
                    >
                      {{ formAlertError }}
                    </v-alert>

                    <v-row class="form-section-row mobile-stack">
                      <v-col cols="12" sm="6" class="mobile-full-width">
                        <v-text-field
                          v-model="formData.firstName"
                          label="First Name"
                          placeholder="Enter first name"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-account"
                          required
                          :error="!!fieldErrors.firstName"
                          @blur="() => validateFormField('firstName')"
                        >
                          <template v-if="fieldErrors.firstName" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ fieldErrors.firstName }}</span>
                            </div>
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" class="mobile-full-width">
                        <v-text-field
                          v-model="formData.lastName"
                          label="Last Name"
                          placeholder="Enter last name"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-account"
                          required
                          :error="!!fieldErrors.lastName"
                          @blur="() => validateFormField('lastName')"
                        >
                          <template v-if="fieldErrors.lastName" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ fieldErrors.lastName }}</span>
                            </div>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-text-field
                      v-model="formData.otherName"
                      label="Other Names"
                      placeholder="Enter other names (optional)"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-account-plus"
                    />

                    <v-text-field
                      v-model="formData.email"
                      label="Email"
                      placeholder="Enter email address"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-email"
                      required
                      :error="!!fieldErrors.email"
                      @blur="() => validateFormField('email')"
                    >
                      <template v-if="fieldErrors.email" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.email }}</span>
                        </div>
                      </template>
                    </v-text-field>

                    <v-text-field
                      v-model="formData.mobileNumber"
                      label="Mobile Number"
                      placeholder="Enter mobile number"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-phone"
                      required
                      :error="!!fieldErrors.mobileNumber"
                      @blur="() => validateFormField('mobileNumber')"
                    >
                      <template v-if="fieldErrors.mobileNumber" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.mobileNumber }}</span>
                        </div>
                      </template>
                    </v-text-field>

                    <v-select
                      v-model="formData.gender"
                      label="Gender"
                      :items="GENDER_OPTIONS"
                      placeholder="Select gender"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-gender-male-female"
                      required
                      :error="!!fieldErrors.gender"
                      @update:model-value="() => validateFormField('gender')"
                      @blur="() => validateFormField('gender')"
                    >
                      <template v-if="fieldErrors.gender" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.gender }}</span>
                        </div>
                      </template>
                    </v-select>

                    <v-text-field
                      v-model="formData.dob"
                      label="Date of Birth"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-calendar"
                      :max="today"
                      required
                      :error="!!fieldErrors.dob"
                      @input="() => validateFormField('dob')"
                      @blur="() => validateFormField('dob')"
                    >
                      <template v-if="fieldErrors.dob" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.dob }}</span>
                        </div>
                      </template>
                    </v-text-field>

                    <div v-if="isUnder18" class="d-flex align-center mb-4 agreement-section">
                      <v-checkbox
                        v-model="formData.isHomeschooled"
                        label="I am homeschooled"
                        class="mr-2 mt-0 pt-0"
                        hide-details
                        density="comfortable"
                      ></v-checkbox>
                    </div>

                    <div v-if="isUnder18">
                      <SchoolNameAutocomplete
                        v-if="!formData.isHomeschooled"
                        v-model="formData.schoolName"
                        :error-message="fieldErrors.schoolName"
                        @validate="() => validateFormField('schoolName')"
                      />
                      <div v-else class="text-caption mb-4 text-secondary">
                        <em>School name not required for homeschooled students</em>
                      </div>
                    </div>

                    <div class="d-flex align-center mb-4 agreement-section">
                      <v-checkbox
                        v-model="formData.hasForeignBankAccount"
                        label="I have a foreign bank account"
                        class="mr-2 mt-0 pt-0"
                        hide-details
                        density="comfortable"
                      ></v-checkbox>
                    </div>

                    <v-select
                      v-model="formData.nationality"
                      label="Nationality"
                      :items="countryList"
                      placeholder="Select nationality"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-flag"
                      required
                      :error="!!fieldErrors.nationality"
                      @update:model-value="() => validateFormField('nationality')"
                      @blur="() => validateFormField('nationality')"
                    >
                      <template v-if="fieldErrors.nationality" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.nationality }}</span>
                        </div>
                      </template>
                    </v-select>

                    <v-select
                      v-model="formData.maritalStatus"
                      label="Marital Status"
                      :items="isAdult ? ADULT_MARITAL_STATUS_OPTIONS : MINOR_MARITAL_STATUS_OPTIONS"
                      placeholder="Select marital status"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-heart"
                      required
                      :error="!!fieldErrors.maritalStatus"
                      @update:model-value="() => validateFormField('maritalStatus')"
                      @blur="() => validateFormField('maritalStatus')"
                    >
                      <template v-if="fieldErrors.maritalStatus" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.maritalStatus }}</span>
                        </div>
                      </template>
                    </v-select>

                    <v-text-field
                      v-model="formData.password"
                      label="Password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Enter password"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      required
                      :error="!!fieldErrors.password"
                      @input="() => validateFormField('password')"
                      @blur="() => validateFormField('password')"
                      @click:append-inner="showPassword = !showPassword"
                    >
                      <template v-if="fieldErrors.password" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.password }}</span>
                        </div>
                      </template>
                    </v-text-field>

                    <v-text-field
                      v-model="formData.confirmPassword"
                      label="Confirm Password"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Confirm password"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-lock-check"
                      :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      required
                      :error="!!fieldErrors.confirmPassword"
                      @input="() => validateFormField('confirmPassword')"
                      @blur="() => validateFormField('confirmPassword')"
                      @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    >
                      <template v-if="fieldErrors.confirmPassword" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ fieldErrors.confirmPassword }}</span>
                        </div>
                      </template>
                    </v-text-field>

                    <PasswordStrengthMeter :strength="passwordStrength" />

                    <v-divider class="my-6"></v-divider>

                    <div class="d-flex align-center mb-4 agreement-section">
                      <v-checkbox
                        v-model="formData.termsViewed"
                        label="I agree to the"
                        class="mr-2 mt-0 pt-0"
                        hide-details
                      ></v-checkbox>
                      <span class="checkbox-label">
                        <a href="#" class="text-decoration-none" @click.prevent="openTerms">
                          Terms and Conditions</a
                        >
                      </span>
                    </div>

                    <div class="d-flex align-center mb-6 agreement-section">
                      <v-checkbox
                        v-model="formData.financialAgreementViewed"
                        label="I agree to the"
                        class="mr-2 mt-0 pt-0"
                        hide-details
                      ></v-checkbox>
                      <span class="checkbox-label">
                        <a
                          href="#"
                          class="text-decoration-none"
                          @click.prevent="openFinancialDeclaration"
                        >
                          Financial Declaration</a
                        >
                      </span>
                    </div>

                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          size="large"
                          height="50"
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

      <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
        <div class="brand-overlay"></div>
      </v-col>
    </v-row>

    <v-dialog v-model="showTerms" max-width="600" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 pa-4 bg-primary text-white">
          Terms and Conditions
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            class="float-right"
            @click="closeTerms"
          />
        </v-card-title>
        <v-card-text class="pa-6">
          <TermsAndConditions @close="closeTerms" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showFinancialDeclaration" max-width="600" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 pa-4 bg-primary text-white">
          Financial Declaration
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            class="float-right"
            @click="closeFinancialDeclaration"
          />
        </v-card-title>
        <v-card-text class="pa-6">
          <FinancialDeclaration @close="closeFinancialDeclaration" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
  </div>
</template>

<script setup>
// Vue composition API imports for reactivity and lifecycle
import { ref, computed, watch } from 'vue';
// Vue Router for navigation between pages
import { useRouter } from 'vue-router';

// Component imports for dialogs and UI elements
import TermsAndConditions from '@/features/onboarding/components/TermsAndConditions.vue';
import FinancialDeclaration from '@/features/onboarding/components/FinancialDeclaration.vue';
import PasswordStrengthMeter from '@/components/ui/PasswordStrengthMeter.vue';
import SchoolNameAutocomplete from '@/components/ui/SchoolNameAutocomplete.vue';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';

// Static asset imports for logos
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

// Store and utility imports
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { calculateAge } from '@/utils/userValidation';
import { countryList } from '@/shared/constants/countries.js';
import {
  GENDER_OPTIONS,
  ADULT_MARITAL_STATUS_OPTIONS,
  MINOR_MARITAL_STATUS_OPTIONS,
} from '@/features/onboarding/constants/basic-info-options.js';
import { useBasicInfoFormManager } from '@/features/onboarding/composables/useBasicInfoFormManager.js';
import { useDemoStore } from '@/store/demoStore';
import { useBasicOnboardingStepper, BASIC_ONBOARDING_STEPS } from '@/composables/useBasicOnboardingStepper.js';

// Initialize router and stores for navigation and state management
const router = useRouter();
const onboardingStore = useOnboardingStore();
const demoStore = useDemoStore();

// Initialize form manager composable that handles form data, validation, and persistence
const {
  formData, // Reactive form data object
  fieldErrors, // Field-specific validation errors
  formAlertError, // General form error messages
  validate, // Function to validate entire form
  validateFormField, // Function to validate individual fields
  clearPersistedFormState, // Function to clear saved form data
  clearErrors, // Function to clear all errors
  parseAndSetApiErrors, // Function to parse and set API errors
} = useBasicInfoFormManager();

// Initialize stepper for progress tracking
const {
  completedSteps,
  currentStepNumber,
  markStepComplete,
  navigateToStep
} = useBasicOnboardingStepper();

// Reactive references for UI state management
const showTerms = ref(false); // Controls Terms and Conditions dialog visibility
const showFinancialDeclaration = ref(false); // Controls Financial Declaration dialog visibility
const showPassword = ref(false); // Controls password field visibility (show/hide)
const showConfirmPassword = ref(false); // Controls confirm password field visibility (show/hide)
// Password strength object for the strength meter component
const passwordStrength = ref({
  overall: 0,
  length: false,
  lowercase: false,
  uppercase: false,
  number: false,
  special: false,
});

// Computed property to get today's date in YYYY-MM-DD format for date input max attribute
const today = computed(() => new Date().toISOString().split('T')[0]);

// Computed property to calculate user's age based on date of birth
const age = computed(() => calculateAge(formData.value.dob));

// Computed property to determine if user is under 18 years old
const isUnder18 = computed(() => age.value < 18);

// Computed property to determine if user is 18 or older
const isAdult = computed(() => age.value >= 18);

// Watcher for date of birth changes to handle age-dependent form logic
watch(
  () => formData.value.dob,
  (newDob) => {
    if (newDob) {
      const currentMaritalStatus = formData.value.maritalStatus;

      // Reset marital status if current selection is invalid for the new age group
      if (isAdult.value) {
        // If user is now adult but has minor-only marital status, clear it
        if (
          currentMaritalStatus &&
          !ADULT_MARITAL_STATUS_OPTIONS.find((opt) => opt.value === currentMaritalStatus)
        ) {
          formData.value.maritalStatus = '';
        }
      } else if (isUnder18.value) {
        // If user is minor but has adult-only marital status, set to 'Single'
        if (
          currentMaritalStatus &&
          !MINOR_MARITAL_STATUS_OPTIONS.find((opt) => opt.value === currentMaritalStatus)
        ) {
          formData.value.maritalStatus = 'Single';
        }
      }

      // Revalidate affected fields after age-related changes
      validateFormField('dob');
      if (formData.value.maritalStatus !== undefined) validateFormField('maritalStatus');
      if (formData.value.schoolName !== undefined) validateFormField('schoolName');
    }
  }
);

// Watcher for homeschooled checkbox changes
watch(
  () => formData.value.isHomeschooled,
  () => {
    if (isUnder18.value) {
      // Clear school name if user selects homeschooled option
      if (formData.value.isHomeschooled) {
        formData.value.schoolName = null;
      }
      // Revalidate school name field (required for non-homeschooled minors)
      validateFormField('schoolName');
    }
  }
);

// Watcher for password changes to update strength meter and trigger validation
watch(
  () => formData.value.password,
  (newPassword) => {
    // Calculate password strength for the strength meter component
    const strengthDetails = localValidatePasswordForStrength(newPassword);
    passwordStrength.value = strengthDetails;

    // Validate password field
    validateFormField('password');
    // Also validate confirm password if it has a value (for password matching)
    if (formData.value.confirmPassword) {
      validateFormField('confirmPassword');
    }
  }
);

// Local function to calculate password strength for UI feedback
const localValidatePasswordForStrength = (password) => {
  const p = password || '';
  const strength = {
    length: p.length >= 8, // At least 8 characters
    lowercase: /[a-z]/.test(p), // Contains lowercase letter
    uppercase: /[A-Z]/.test(p), // Contains uppercase letter
    number: /[0-9]/.test(p), // Contains number
    special: /[^a-zA-Z0-9]/.test(p), // Contains special character
    overall: 0, // Overall strength score
  };
  // Calculate overall score based on criteria met
  strength.overall = Object.values(strength).filter((v) => typeof v === 'boolean' && v).length;
  return strength;
};

// Dialog control functions for Terms and Conditions
const openTerms = () => {
  showTerms.value = true;
};
const closeTerms = () => {
  showTerms.value = false;
};

// Dialog control functions for Financial Declaration
const openFinancialDeclaration = () => {
  showFinancialDeclaration.value = true;
};
const closeFinancialDeclaration = () => {
  showFinancialDeclaration.value = false;
};

// Stepper event handlers
const handleStepChange = ({ stepIndex, step }) => {
  console.log('Step changed:', step.title);
};

const handleStepClick = ({ stepIndex, step }) => {
  navigateToStep(step.route);
};

// Main form submission handler
const handleSubmit = async () => {
  // Validate entire form using schema validation
  const validationResult = await validate(formData.value);
  if (!validationResult.isValid) {
    return; // Stop submission if validation fails
  }

  try {
    // Submit form data to the onboarding store/API
    const storeSubmissionResult = await onboardingStore.submitBasicInfoFormData(formData.value);

    if (storeSubmissionResult.success) {
      // Store signup ID for next step if available
      if (storeSubmissionResult.data && storeSubmissionResult.data.id) {
        demoStore.setSignupId(storeSubmissionResult.data.id);
      } else {
        console.warn('No signupId found in response data');
      }

      // Mark current step as complete
      markStepComplete('/basic-info');

      // Clear persisted form data after successful submission
      clearPersistedFormState();

      // Navigate to email verification step with slight delay for state updates
      setTimeout(async () => {
        try {
          await router.push('/email-verification');
        } catch (navigationError) {
          // Fallback navigation method if router fails
          window.location.href = '/email-verification';
        }
      }, 100);
    } else {
      // Handle submission errors using proper API error parsing
      // Clear any existing client-side validation errors first
      clearErrors();

      // Parse and set backend errors using the form manager's API error parser
      if (storeSubmissionResult.error && storeSubmissionResult.error.response) {
        parseAndSetApiErrors(storeSubmissionResult.error.response.data);
      } else {
        // Handle cases where we have parsed errors from the store
        if (storeSubmissionResult.fieldMessages) {
          // Manually set field errors if they're already parsed
          Object.keys(storeSubmissionResult.fieldMessages).forEach((fieldName) => {
            fieldErrors.value = {
              ...fieldErrors.value,
              [fieldName]: storeSubmissionResult.fieldMessages[fieldName],
            };
          });
        }

        if (storeSubmissionResult.generalMessage) {
          formAlertError.value = storeSubmissionResult.generalMessage;
        } else if (!Object.keys(storeSubmissionResult.fieldMessages || {}).length) {
          formAlertError.value = 'An unexpected error occurred during submission.';
        }
      }
    }
  } catch (error) {
    // Handle unexpected errors during submission
    console.error('Unexpected error during form submission:', error);

    // Clear any existing errors first
    clearErrors();

    // Try to parse API errors from the caught error
    if (error.response && error.response.data) {
      parseAndSetApiErrors(error.response.data);
    } else {
      // Fallback to generic error message
      formAlertError.value = 'A system error occurred. Please try again later.';
    }
  }
};

// Navigation function to go back to previous page
const navigateToPrevious = () => {
  router.go(-1);
};
</script>

<style scoped>
.form-section {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
}

.form-container {
  max-width: 100%;
  padding: 2.5rem 1.5rem;
}

.form-card {
  background: linear-gradient(145deg, #ffffff, #f9f9ff);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.05),
    0 1px 5px rgba(0, 0, 0, 0.03) !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.primary-text {
  color: var(--v-primary-base, #1976d2);
  font-size: 2rem;
  letter-spacing: -0.5px;
}

:deep(.v-field) {
  border-radius: 12px !important;
  box-shadow: none !important;
  transition: all 0.2s ease;
}

:deep(.v-field:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
}

:deep(.v-field__outline) {
  opacity: 1 !important;
}

:deep(.v-text-field .v-input__details) {
  padding-left: 16px;
}

/* Enhanced error message styling */
:deep(.v-input__details) {
  padding: 4px 16px 8px;
  margin-top: 4px;
}

:deep(.v-messages__message) {
  line-height: 1.5;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 4px 0;
  color: var(--v-error-base);
  display: flex;
  align-items: flex-start;
}

:deep(.v-messages__message::before) {
  content: '•';
  margin-right: 6px;
}

:deep(.v-field--error) {
  margin-bottom: 8px;
  border-left: 2px solid var(--v-error-base);
  background-color: rgba(244, 67, 54, 0.03);
}

/* Add more space between form fields */
.v-text-field,
.v-select {
  margin-bottom: 16px;
}

/* Make error messages more visible */
:deep(.v-field__input.error--text) {
  color: var(--v-error-base) !important;
}

.next-button {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  height: 56px;
  transition: all 0.3s ease;
}

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
}

.back-button {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 56px;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
}

.agreement-section {
  background-image: linear-gradient(to right, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.01));
  border-left: 4px solid var(--v-primary-base);
}

.form-section-row {
  margin-bottom: 1rem;
}

:deep(.v-checkbox) {
  margin: 0;
  padding: 0;
}

:deep(.v-selection-control) {
  margin-bottom: 0;
}

:deep(.v-alert) {
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.v-select__content) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

:deep(.v-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

:deep(.v-card-title) {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  padding: 24px;
}

:deep(.v-date-picker) {
  border-radius: 12px;
  overflow: hidden;
}

/* Mobile Responsiveness */
@media (max-width: var(--breakpoint-xs)) {
  .form-section {
    height: auto;
    min-height: 100vh;
  }

  .form-container {
    padding: 1.5rem 1rem;
  }

  .form-card {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .primary-text {
    font-size: 1.75rem;
  }

  :deep(.v-field) {
    border-radius: 10px !important;
  }

  .agreement-section {
    padding: 12px 16px;
  }
}

/* Add animation for form fields focus */
:deep(.v-field--focused) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.15) !important;
  border-bottom: 2px solid var(--v-primary-base);
}

/* Style for required field indicators */
:deep(.v-label.v-field-label) {
  opacity: 0.8;
  font-weight: 500;
}

:deep(.v-label.v-field-label--required::after) {
  content: ' *';
  color: var(--v-error-base);
}

/* Enhanced checkbox styling */
:deep(.v-checkbox .v-selection-control__input) {
  transform: scale(1.1);
}

/* Dialog content styling */
:deep(.v-card-text) {
  padding: 24px;
  line-height: 1.6;
}

/* Terms and Financial Declaration links */
.checkbox-label a {
  color: var(--v-primary-base, #1976d2);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.checkbox-label a:hover {
  color: var(--v-primary-darken-1);
  text-decoration: underline;
}

.logo-wrapper {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

@media (max-width: var(--breakpoint-xs)) {
  .logo-wrapper {
    width: 80px;
    height: 80px;
  }
}

/* Improved error styling */
.custom-error-container {
  padding: 6px 8px;
  background-color: rgba(244, 67, 54, 0.06);
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.custom-error-container span {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--v-error-base);
}

/* Stepper styling */
.basic-info-page {
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

@media (max-width: 960px) {
  .stepper-container {
    position: relative;
    padding: 0.5rem 0;
  }
}
</style>
