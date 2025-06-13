<template>
  <div class="membership-declaration-page">
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
                    Membership Declaration Agreement
                  </h1>
                </div>

                <v-card class="form-card" elevation="0" rounded="lg">
                  <v-card-text>
                    <v-alert
                      v-if="onboardingStore.apiSubmitError"
                      type="error"
                      variant="tonal"
                      class="mb-4"
                    >
                      {{ onboardingStore.apiSubmitError }}
                    </v-alert>

                    <h2 class="text-body-1 mb-4">
                      I hereby make application for membership in
                      <strong>CATHEDRAL CREDIT UNION CO-OPERATIVE SOCIETY LIMITED</strong> and if
                      admitted, agree to abide by the Bye-Laws or amendments of the said Society. I
                      am aware that I am not a bona fide member of the society until this
                      application is approved by the Board of Directors. I further pledge to offer
                      my skills towards the growth of the Society.
                    </h2>

                    <v-form @submit.prevent="handleSubmit">
                      <!-- Credit Union Membership -->
                      <label class="text-subtitle-1 mb-2 d-block"
                        >Are you a member of another credit union?</label
                      >
                      <v-radio-group
                        v-model="formManager.formData.value.isMemberOfAnotherCreditUnion"
                        :error-messages="formManager.fieldErrors.value.isMemberOfAnotherCreditUnion"
                        class="mb-2"
                        inline
                      >
                        <v-radio label="Yes" value="yes" />
                        <v-radio label="No" value="no" />
                      </v-radio-group>

                      <v-text-field
                        v-if="formManager.formData.value.isMemberOfAnotherCreditUnion === 'yes'"
                        v-model="formManager.formData.value.creditUnionName"
                        label="Name of Credit Union"
                        placeholder="Enter credit union name"
                        variant="outlined"
                        density="comfortable"
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-bank"
                        :error-messages="formManager.fieldErrors.value.creditUnionName"
                        class="mb-4"
                        @blur="() => formManager.validate(formManager.formData.value)"
                      />

                      <!-- Board Service -->
                      <label class="text-subtitle-1 mb-2 d-block"
                        >Are you serving on another Credit Union/State Board of
                        Directors/Committee?</label
                      >
                      <v-radio-group
                        v-model="formManager.formData.value.isServingOnBoard"
                        :error-messages="formManager.fieldErrors.value.isServingOnBoard"
                        class="mb-2"
                        inline
                      >
                        <v-radio label="Yes" value="yes" />
                        <v-radio label="No" value="no" />
                      </v-radio-group>

                      <v-text-field
                        v-if="formManager.formData.value.isServingOnBoard === 'yes'"
                        v-model="formManager.formData.value.creditUnionBoardName"
                        label="Name of Board"
                        placeholder="Enter board name"
                        variant="outlined"
                        density="comfortable"
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-account-group"
                        :error-messages="formManager.fieldErrors.value.creditUnionBoardName"
                        class="mb-4"
                        @blur="() => formManager.validate(formManager.formData.value)"
                      />

                      <v-row class="mt-6">
                        <v-col cols="12" sm="6" order="1" order-sm="2">
                          <v-btn
                            block
                            color="primary"
                            size="large"
                            variant="flat"
                            height="44"
                            type="submit"
                            :loading="onboardingStore.isLoading"
                          >
                            {{ onboardingStore.isLoading ? 'Processing...' : 'Agree' }}
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" order="2" order-sm="1">
                          <v-btn
                            block
                            color="secondary"
                            variant="flat"
                            size="large"
                            height="44"
                            :disabled="onboardingStore.isLoading"
                            @click="handleDisagree"
                          >
                            Disagree
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

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useMembershipDeclarationFormManager } from '@/features/onboarding/composables/useMembershipDeclarationFormManager.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import {
  useCompleteOnboardingStepper,
  COMPLETE_ONBOARDING_STEPS,
} from '@/composables/useCompleteOnboardingStepper.js';
// No direct use of useDemoStore or post service needed here anymore

// Define form data interface
interface MembershipDeclarationFormData {
  isMemberOfAnotherCreditUnion: string;
  creditUnionName: string;
  isServingOnBoard: string;
  creditUnionBoardName: string;
}

const router = useRouter();
const onboardingStore = useOnboardingStore();
const formManager = useMembershipDeclarationFormManager();

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

  const validationResult = await formManager.validate(formManager.formData.value);
  if (!validationResult.isValid) {
    // If serverError from useSimpleFormValidation is used for general Zod messages:
    // onboardingStore.apiSubmitError = formManager.serverError.value;
    return;
  }

  const result = await onboardingStore.submitMembershipDeclaration(formManager.formData.value);

  if (result.success) {
    // Mark current step as complete
    markStepComplete('/membership-declaration-agreement');
    router.push('/politically-exposed-persons'); // Or next relevant route
  } else {
    // General API error is already set in onboardingStore.apiSubmitError
    // Field-specific API errors are in onboardingStore.apiFieldErrors
    // We might need to map them to formManager.fieldErrors if the template relies on it
    if ((result as any).fieldMessages) {
      for (const key in (result as any).fieldMessages) {
        formManager.fieldErrors.value[key] = (result as any).fieldMessages[key];
      }
    }
  }
};

const handleDisagree = () => {
  // Navigate to a different page or show a message if user disagrees
  router.push('/'); // Example: navigate to home
};

// Watch for API field errors from the store and update formManager's errors
watch(
  () => onboardingStore.apiFieldErrors,
  (newErrors) => {
    if (newErrors) {
      const currentManagerErrors = formManager.fieldErrors.value || {};
      let updated = false;
      for (const key in newErrors) {
        if (currentManagerErrors[key] !== newErrors[key]) {
          currentManagerErrors[key] = newErrors[key];
          updated = true;
        }
      }
      // Clear fields in manager that are no longer in API errors
      for (const key in currentManagerErrors) {
        if (!newErrors[key]) {
          delete currentManagerErrors[key];
          updated = true;
        }
      }
      if (updated) {
        formManager.fieldErrors.value = { ...currentManagerErrors };
      }
    }
  },
  { deep: true }
);

// Clear server/API errors when form data changes
watch(
  formManager.formData,
  () => {
    if (onboardingStore.apiSubmitError) {
      onboardingStore.apiSubmitError = null;
    }
    // Optionally clear formManager's Zod errors or specific apiFieldErrors from store as user types
  },
  { deep: true }
);

onMounted(() => {
  // Clear any previous API errors when the component mounts
  onboardingStore.apiSubmitError = null;
  onboardingStore.apiFieldErrors = {};
  formManager.clearErrors(); // Clear Zod errors as well

  // If form data needs to be loaded from demoStore via onboardingStore action or formManager itself:
  // Example: formManager.loadPersistedData();
  // Or, if onboardingStore had an action like:
  // const initialData = onboardingStore.getMembershipDeclarationData();
  // if(initialData) formManager.formData.value = { ...formManager.formData.value, ...initialData };
});

interface Emits {
  'close': [];
}

defineEmits<Emits>();
</script>

<style scoped>
/* Stepper styling */
.membership-declaration-page {
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
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.form-card {
  border-radius: 24px; /* Match other cards */
  background-color: white;
  padding: 2.5rem; /* Match other cards */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06); /* Match other cards */
}

.primary-text {
  color: var(--v-primary-base);
  font-size: 2.25rem; /* Match other headers */
  letter-spacing: -0.5px;
  line-height: 1.2;
  font-weight: 700;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

:deep(.v-btn) {
  height: 54px; /* Match other cards */
  border-radius: 14px; /* Match other cards */
  font-weight: 600;
  letter-spacing: 0.25px;
  text-transform: none;
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
  border-radius: 14px !important; /* Match other inputs */
  box-shadow: none !important;
  background: rgba(247, 248, 249, 0.7) !important;
}

/* Brand Section Styling - Copied from MobileVerification for consistency */

.brand-logo {
  z-index: 2;
  max-width: 300px; /* Or your desired size */
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

  :deep(.v-btn) {
    height: 50px;
    border-radius: 12px;
  }
}
</style>

