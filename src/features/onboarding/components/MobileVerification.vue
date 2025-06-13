<template>
  <div class="mobile-verification-page">
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

                <h1 class="text-h4 font-weight-bold primary-text mb-2">
                  Mobile [SMS] Verification
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Enter the verification code sent as an SMS to your mobile phone
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert v-if="formSubmitError" type="error" variant="tonal" class="mb-4">
                    {{ formSubmitError }}
                  </v-alert>

                  <v-alert v-if="onboardingStore.apiSubmitError" type="error" variant="tonal" class="mb-4">
                    {{ onboardingStore.apiSubmitError }}
                  </v-alert>

                  <v-form @submit.prevent="handleSubmit">
                    <v-text-field
                      v-model="formData.verificationCode"
                      label="Verification Code"
                      placeholder="Enter 6-digit code"
                      :error-messages="fieldErrors.verificationCode || onboardingStore.apiFieldErrors.verificationCode"
                      maxlength="6"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-shield-lock"
                      required
                      @input="formatInput"
                      @blur="validate"
                    />

                    <!-- Add resend code section -->
                    <div class="d-flex align-center justify-space-between mb-4">
                      <v-btn
                        variant="text"
                        color="primary"
                        :disabled="isResendDisabled || isSendingCode"
                        :loading="isSendingCode"
                        class="px-0"
                        @click="handleResendVerificationCode"
                      >
                        <v-icon class="mr-1">mdi-refresh</v-icon>
                        Resend Code
                      </v-btn>
                      <div v-if="countdown > 0" class="text-caption">
                        Resend in {{ countdown }}s
                      </div>
                      <div
                        v-else-if="resendCount >= maxResendAttempts"
                        class="text-caption text-error"
                      >
                        Maximum resend attempts reached
                      </div>
                    </div>

                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="1" order-sm="2">
                        <v-btn
                          block
                          color="primary"
                          size="large"
                          variant="flat"
                          height="44"
                          type="submit"
                          :loading="isLoading"
                          class="next-button"
                          append-icon="mdi-arrow-right"
                        >
                          {{ isLoading ? 'Processing...' : 'Verify' }}
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          size="large"
                          variant="flat"
                          height="44"
                          :disabled="isLoading"
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
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDemoStore } from '@/store/demoStore';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useMobileVerificationFormManager } from '@/features/onboarding/composables/useMobileVerificationFormManager.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import { useBasicOnboardingStepper, BASIC_ONBOARDING_STEPS } from '@/composables/useBasicOnboardingStepper.js';

const router = useRouter();
const demoStore = useDemoStore();
const onboardingStore = useOnboardingStore();

// Initialize form manager composable
const {
  formData,
  fieldErrors,
  formSubmitError,
  validate,
  handleSubmit: formHandleSubmit,
  handleRequestNewCode,
  navigateToPrevious: formNavigateToPrevious,
  getNavigationForError,
  formatInput,
  countdown,
  resendCount,
  maxResendAttempts,
  isResendDisabled,
  isSendingCode,
  isLoading,
} = useMobileVerificationFormManager();

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
    markStepComplete('/mobile-verification');
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

const handleResendVerificationCode = async () => {
  if (isResendDisabled.value || isSendingCode.value) {
    return;
  }
  await handleRequestNewCode();
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

// Watch for form data changes to clear error messages
watch(formData, () => {
  if (formSubmitError.value) {
    formSubmitError.value = null;
  }
  if (fieldErrors.value.verificationCode && formData.value.verificationCode) {
    delete fieldErrors.value.verificationCode;
  }
  if (onboardingStore.apiFieldErrors.verificationCode && formData.value.verificationCode) {
    delete onboardingStore.apiFieldErrors.verificationCode;
  }
}, { deep: true });

onMounted(async () => {
  if (!demoStore.signupId) {
    router.push('/signup');
    return;
  }
});
</script>

<style scoped>
/* Stepper styling */
.mobile-verification-page {
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
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.form-section::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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
  position: relative;
}

:deep(.back-button.v-btn) {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.8);
}

:deep(.back-button:hover) {
  background-color: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

:deep(.v-alert) {
  border-radius: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(var(--v-theme-error), 0.08) !important;
  border: 1px solid rgba(var(--v-theme-error), 0.1) !important;
}

.resend-link {
  color: var(--v-primary-base);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.resend-link:hover {
  color: var(--v-primary-darken1);
  text-decoration: underline;
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

@media (max-width: 959px) {
  .form-container {
    padding: 2rem 1.25rem;
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
}
</style> 