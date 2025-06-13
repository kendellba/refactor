<template>
  <div class="email-verification-page">
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
                <v-img
                  :src="logoImage"
                  alt="Cathedral Engage"
                  class="mx-auto mb-4"
                  width="100"
                  height="100"
                />
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Email Verification</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Enter the verification code sent to {{ userEmail || 'your email' }}
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert v-if="formSubmitError" type="error" variant="tonal" class="mb-4">
                    {{ formSubmitError }}
                  </v-alert>

                  <v-form @submit.prevent="handleSubmit">
                    <v-text-field
                      v-model="formData.verificationCode"
                      label="Verification Code"
                      placeholder="Enter 6-digit code"
                      :error-messages="getFieldError('verificationCode')"
                      :maxlength="VERIFICATION_CODE_LENGTH"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-shield-lock"
                      required
                      @input="formatInput"
                      @blur="validateField('verificationCode')"
                    />

                    <v-row class="mt-6">
                      <v-col cols="12" class="text-center mb-4">
                        <v-btn
                          variant="text"
                          color="primary"
                          :loading="isRequestingCode"
                          :disabled="countdown > 0 || isRequestingCode"
                          @click="handleRequestNewCode"
                        >
                          {{ 
                            isRequestingCode 
                              ? 'Sending...' 
                              : (countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code') 
                          }}
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
                          :loading="isLoading"
                          :disabled="isLoading || isRequestingCode"
                          class="next-button"
                          append-icon="mdi-arrow-right"
                        >
                          {{ isLoading ? 'Verifying...' : 'Verify' }}
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          variant="flat"
                          size="large"
                          height="44"
                          :disabled="isLoading || isRequestingCode"
                          class="back-button"
                          prepend-icon="mdi-arrow-left"
                          @click="navigateToPrevious"
                        >
                          Back
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>

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

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEmailVerificationFormManager } from '@/features/onboarding/composables/useEmailVerificationFormManager.js';
import { VERIFICATION_CODE_LENGTH } from '@/features/onboarding/constants/email-verification-options.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import { useBasicOnboardingStepper, BASIC_ONBOARDING_STEPS } from '@/composables/useBasicOnboardingStepper.js';

const router = useRouter();

// Initialize form manager composable
const {
  formData,              // Reactive form data object
  fieldErrors,           // Client-side validation errors
  formSubmitError,       // General form submission error
  validateField,         // Field validation function
  handleSubmit: formHandleSubmit,          // Form submission handler
  handleRequestNewCode,  // Resend code handler
  navigateToPrevious: formNavigateToPrevious,    // Navigation handler
  getNavigationForError, // Check if error requires navigation
  formatInput,           // Input formatting function
  countdown,             // Resend countdown timer
  userEmail,             // User's email address
  isRequestingCode,      // Requesting new code loading state
  isLoading,             // Form submission loading state
} = useEmailVerificationFormManager();

// Initialize stepper for progress tracking
const {
  completedSteps,
  currentStepNumber,
  markStepComplete,
  navigateToStep
} = useBasicOnboardingStepper();

// Stepper event handlers
const handleStepChange = ({ stepIndex, step }) => {
  console.log('Step changed:', step.title);
};

const handleStepClick = ({ stepIndex, step }) => {
  navigateToStep(step.route);
};

// Component-level handlers that manage navigation
const handleSubmit = async () => {
  const result = await formHandleSubmit();
  if (result.success && result.shouldNavigate) {
    // Mark current step as complete
    markStepComplete('/email-verification');
    router.push(result.route);
  }
};

const navigateToPrevious = () => {
  const result = formNavigateToPrevious();
  if (result.shouldNavigate) {
    if (result.route === 'back') {
      router.go(-1);
  } else {
      router.push(result.route);
    }
  }
};

// Watch for errors that require navigation
watch(formSubmitError, (newError) => {
  if (newError) {
    const navigation = getNavigationForError();
    if (navigation.shouldNavigate) {
      setTimeout(() => {
        router.push(navigation.route);
      }, 2000); // Give user time to read the error message
    }
  }
});

// Defensive function to get field errors with proper null checking
const getFieldError = (fieldName) => {
  return fieldErrors?.value?.[fieldName] || null;
};
</script>

<style scoped>
/* Stepper styling */
.email-verification-page {
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

/* Your existing styles */
.form-section {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  min-height: 100vh;
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
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-btn) {
  height: 48px;
  border-radius: 8px;
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
}
</style> 
