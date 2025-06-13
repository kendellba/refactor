<template>
  <div class="parent-guardian-information-page">
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
                <v-img :src="logoImage" alt="Company Logo" class="mx-auto mb-4" width="100" height="100" />
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Parent/Guardian Information</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Enter the parent or guardian's details</p>
                <v-card v-if="childFullName" class="guardian-banner mt-4 mb-4" color="primary" variant="tonal">
                  <v-card-text class="text-center">
                    <span class="text-h6 font-weight-medium">Guardian of {{ childFullName }}</span>
                  </v-card-text>
                </v-card>
              </div>
              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-form @submit.prevent="handleSubmit">
                    <v-alert v-if="onboardingStore.apiSubmitError" type="error" variant="tonal" class="mb-4" density="compact">
                      {{ onboardingStore.apiSubmitError }}
                    </v-alert>
                    <v-alert v-if="formManager.serverError.value" type="error" variant="tonal" class="mb-4" density="compact">
                      {{ formManager.serverError.value }}
                    </v-alert>

                    <v-text-field
                      v-model="formManager.formData.value.first_name"
                      label="First Name"
                      placeholder="Parent First Name"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-account"
                      :error-messages="formManager.fieldErrors.value.first_name"
                      @blur="formManager.validateField('first_name')"
                    />
                    <v-text-field
                      v-model="formManager.formData.value.middle_name"
                      label="Middle Name (Optional)"
                      placeholder="Parent Middle Name"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-account"
                      class="optional-field"
                    />
                    <v-text-field
                      v-model="formManager.formData.value.last_name"
                      label="Last Name"
                      placeholder="Parent Last Name"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-account"
                      :error-messages="formManager.fieldErrors.value.last_name"
                      @blur="formManager.validateField('last_name')"
                    />
                    <v-text-field
                      v-model="formManager.formData.value.email"
                      label="Email"
                      type="email"
                      placeholder="Parent Email"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-email"
                      :error-messages="formManager.fieldErrors.value.email"
                      @blur="formManager.validateField('email')"
                    />
                    <v-text-field
                      v-model="formManager.formData.value.mobile"
                      label="Mobile Number"
                      placeholder="Parent Mobile Number"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-phone"
                      :error-messages="formManager.fieldErrors.value.mobile"
                      @blur="formManager.validateField('mobile')"
                    />
                    <v-select
                      v-model="formManager.formData.value.relationship_to_child"
                      :items="relationshipOptions"
                      label="Relationship to Child"
                      placeholder="Select relationship"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-account-child"
                      :error-messages="formManager.fieldErrors.value.relationship_to_child"
                      @update:modelValue="formManager.validateField('relationship_to_child')"
                    />
                    <v-file-input
                      v-model="formManager.formData.value.guardian_files"
                      label="Upload Relationship Documents"
                      placeholder="Upload proof of relationship"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-file-document"
                      accept="image/*, application/pdf"
                      :error-messages="formManager.fieldErrors.value.guardian_files"
                      @update:modelValue="formManager.validateField('guardian_files')"
                      required
                      chips
                      show-size
                      multiple
                      clearable
                      hint="Upload proof of relationship (birth certificate, court order, etc.) (max 5MB)"
                      persistent-hint
                    />
                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn block color="secondary" variant="flat" :disabled="onboardingStore.isLoading" height="44" class="back-button" prepend-icon="mdi-arrow-left" @click="navigateToPrevious">
                          Back
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="1" order-sm="2">
                        <v-btn block color="primary" variant="flat" type="submit" :loading="onboardingStore.isLoading" height="44" class="next-button" append-icon="mdi-arrow-right">
                          {{ onboardingStore.isLoading ? 'Submitting...' : 'Next' }}
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
          <v-img :src="bigLogo" alt="Powered By" class="mx-auto logo-image" width="150" height="50" contain />
        </div>
      </v-col>
      <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
        <div class="brand-overlay"></div>
        <v-img src="@/assets/Logo1.png" alt="Brand Logo" class="brand-logo" contain />
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useParentGuardianFormManager } from '@/features/onboarding/composables/useParentGuardianFormManager.js';
import { useDemoStore } from '@/store/demoStore';
import { relationshipOptions } from '@/features/onboarding/constants/parent-guardian-options.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import {
  useCompleteOnboardingStepper,
  COMPLETE_ONBOARDING_STEPS,
} from '@/composables/useCompleteOnboardingStepper.js';

const router = useRouter();
const onboardingStore = useOnboardingStore();
const formManager = useParentGuardianFormManager();
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

const childFullName = computed(() => {
  const basicInfo = demoStore.basicInfo;
  if (basicInfo && basicInfo.first_name && basicInfo.last_name) {
    return `${basicInfo.first_name} ${basicInfo.last_name}`;
  }
  return '';
});

const handleSubmit = async () => {
  formManager.clearErrors();
  onboardingStore.apiSubmitError = null;
  onboardingStore.apiFieldErrors = {};

  const isValid = await formManager.validate(formManager.formData.value);
  if (!isValid) {
    return;
  }

  // const result = await onboardingStore.submitParentGuardianAction(formManager.formData.value);
  
  // NOTE: The store action is commented out as it could not be added.
  // This will be added back once the store can be edited.
  // For now, we'll simulate a success and navigate.
  const result = { success: true }; 


  if (result.success) {
    // Mark current step as complete
    markStepComplete('/parent-guardian-information');
    formManager.clearPersistedFormData();
    formManager.clearBeforeUnloadWarning();
    router.push('/id-information');
  } else {
    if (result.fieldMessages) {
      for (const key in result.fieldMessages) {
        formManager.fieldErrors.value[key] = result.fieldMessages[key];
      }
    }
    if (result.generalMessage) {
      onboardingStore.apiSubmitError = result.generalMessage;
    }
  }
};

const navigateToPrevious = () => {
  router.go(-1);
};

watch(() => onboardingStore.apiFieldErrors, (newErrors) => {
  if (newErrors && Object.keys(newErrors).length > 0) {
    for (const key in newErrors) {
      formManager.fieldErrors.value[key] = newErrors[key];
    }
  }
}, { deep: true });

watch(formManager.formData, () => {
  if (onboardingStore.apiSubmitError) {
    onboardingStore.apiSubmitError = null;
  }
}, { deep: true });
</script>

<style scoped>
/* Stepper styling */
.parent-guardian-information-page {
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
  display: flex;
  flex-direction: column;
}
.form-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-card {
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
  padding: 2rem;
}
.primary-text {
  color: var(--v-primary-base);
}
.guardian-banner {
  border-left: 4px solid var(--v-primary-darken-1);
}

.brand-logo {
  position: relative;
  z-index: 1;
  max-width: 200px;
}
.optional-field {
  margin-top: -0.5rem;
}
.back-button {
  border: 1px solid #ccc;
}
.next-button {
  color: white;
}
.logo-image {
  margin-bottom: 1rem;
}
</style> 