<template>
  <div class="power-of-attorney-page">
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
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Form Section -->
        <v-col cols="12" md="7" class="form-section pa-0">
          <v-container class="form-container pa-md-8 pa-sm-6 pa-4">
            <v-row justify="center" align="start">
              <v-col cols="12" xl="8" lg="10" md="12">
                <div class="text-center mb-6">
                  <v-img
                    :src="logoImage"
                    alt="Company Logo"
                    class="mx-auto mb-3"
                    width="80"
                    height="80"
                    contain
                  />
                  <h1 class="text-h4 font-weight-bold primary-text mb-1">Power of Attorney</h1>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    Enter the Power of Attorney's details and upload required documents.
                  </p>
                </div>

                <v-card class="form-card" elevation="0" rounded="xl">
                  <v-card-text class="pa-sm-8 pa-5">
                    <v-form @submit.prevent="handleSubmit">
                      <v-alert
                        v-if="onboardingStore.apiSubmitError"
                        type="error"
                        variant="tonal"
                        class="mb-4"
                        density="compact"
                      >
                        {{ onboardingStore.apiSubmitError }}
                      </v-alert>
                      <v-alert
                        v-if="formManager.serverError.value"
                        type="error"
                        variant="tonal"
                        class="mb-4"
                        density="compact"
                      >
                        {{ formManager.serverError.value }}
                      </v-alert>
                      <v-alert
                        v-if="poaFormAlert"
                        :type="poaFormAlert.type"
                        :text="poaFormAlert.message"
                        class="mb-4"
                      />

                      <!-- Personal Information Section -->
                      <section class="mb-6">
                        <h2 class="text-h6 font-weight-semibold mb-4 primary-text">
                          Personal Information
                        </h2>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="poaFormData.first_name"
                              label="First Name"
                              placeholder="Enter first name"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account"
                              required
                              :error="!!poaFieldErrors?.first_name"
                              @blur="formManager.validate('first_name')"
                            >
                              <template v-if="poaFieldErrors?.first_name" #details>
                                <div class="custom-error-container">
                                  <v-icon size="small" color="error" class="mr-1">
                                    mdi-alert-circle
                                  </v-icon>
                                  <span>{{ poaFieldErrors.first_name }}</span>
                                </div>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="poaFormData.last_name"
                              label="Last Name"
                              placeholder="Enter last name"
                              variant="outlined"
                              density="comfortable"
                              bg-color="grey-lighten-5"
                              prepend-inner-icon="mdi-account"
                              required
                              :error="!!poaFieldErrors?.last_name"
                              @blur="formManager.validate('last_name')"
                            >
                              <template v-if="poaFieldErrors?.last_name" #details>
                                <div class="custom-error-container">
                                  <v-icon size="small" color="error" class="mr-1">
                                    mdi-alert-circle
                                  </v-icon>
                                  <span>{{ poaFieldErrors.last_name }}</span>
                                </div>
                              </template>
                            </v-text-field>
                          </v-col>
                        </v-row>

                        <v-text-field
                          v-model="poaFormData.middle_name"
                          label="Middle Name"
                          placeholder="Enter middle name (optional)"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-account-plus"
                          :error="!!poaFieldErrors?.middle_name"
                          @blur="formManager.validate('middle_name')"
                        >
                          <template v-if="poaFieldErrors?.middle_name" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.middle_name }}</span>
                            </div>
                          </template>
                        </v-text-field>

                        <v-text-field
                          v-model="poaFormData.dob"
                          label="Date of Birth"
                          type="date"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-calendar"
                          required
                          :error="!!poaFieldErrors?.dob"
                          @blur="formManager.validate('dob')"
                        >
                          <template v-if="poaFieldErrors?.dob" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.dob }}</span>
                            </div>
                          </template>
                        </v-text-field>

                        <v-select
                          v-model="poaFormData.gender"
                          label="Gender"
                          :items="['Male', 'Female']"
                          placeholder="Select gender"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-gender-male-female"
                          required
                          :error="!!poaFieldErrors?.gender"
                          @update:model-value="formManager.validate('gender')"
                        >
                          <template v-if="poaFieldErrors?.gender" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.gender }}</span>
                            </div>
                          </template>
                        </v-select>

                        <v-text-field
                          v-model="poaFormData.email"
                          label="Email Address"
                          type="email"
                          placeholder="Enter email address"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-email"
                          required
                          :error="!!poaFieldErrors?.email"
                          @blur="formManager.validate('email')"
                        >
                          <template v-if="poaFieldErrors?.email" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.email }}</span>
                            </div>
                          </template>
                        </v-text-field>

                        <v-text-field
                          v-model="poaFormData.phone"
                          label="Phone Number"
                          type="tel"
                          placeholder="Enter phone number"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-phone"
                          required
                          :error="!!poaFieldErrors?.phone"
                          @blur="formManager.validate('phone')"
                        >
                          <template v-if="poaFieldErrors?.phone" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.phone }}</span>
                            </div>
                          </template>
                        </v-text-field>

                        <v-autocomplete
                          v-model="poaFormData.relationship_to_principal"
                          label="Relationship to Principal"
                          :items="relationshipOptions"
                          placeholder="Start typing relationship"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-account-heart-outline"
                          required
                          clearable
                          auto-select-first
                          hide-no-data
                          :error="!!poaFieldErrors?.relationship_to_principal"
                          @update:model-value="formManager.validate('relationship_to_principal')"
                        >
                          <template v-if="poaFieldErrors?.relationship_to_principal" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.relationship_to_principal }}</span>
                            </div>
                          </template>
                        </v-autocomplete>
                      </section>

                      <!-- Address Information Section -->
                      <section class="mb-6">
                        <h2 class="text-h6 font-weight-semibold mb-4 primary-text">
                          Address Information
                        </h2>
                        <v-text-field
                          v-model="poaFormData.address_line_1"
                          label="Address Line 1"
                          placeholder="Enter street address"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-map-marker"
                          required
                          :error="!!poaFieldErrors?.address_line_1"
                          @blur="formManager.validate('address_line_1')"
                        >
                          <template v-if="poaFieldErrors?.address_line_1" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.address_line_1 }}</span>
                            </div>
                          </template>
                        </v-text-field>

                        <v-text-field
                          v-model="poaFormData.address_line_2"
                          label="Address Line 2"
                          placeholder="Enter address line 2 (optional)"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-map-marker-outline"
                          :error="!!poaFieldErrors?.address_line_2"
                          @blur="formManager.validate('address_line_2')"
                        >
                          <template v-if="poaFieldErrors?.address_line_2" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.address_line_2 }}</span>
                            </div>
                          </template>
                        </v-text-field>

                        <v-text-field
                          v-model="poaFormData.city"
                          label="City"
                          placeholder="Enter city"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-city"
                          required
                          :error="!!poaFieldErrors?.city"
                          @blur="formManager.validate('city')"
                        >
                          <template v-if="poaFieldErrors?.city" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.city }}</span>
                            </div>
                          </template>
                        </v-text-field>

                        <v-select
                          v-model="poaFormData.country"
                          label="Country"
                          :items="countryList"
                          item-title="name"
                          item-value="code"
                          placeholder="Select country"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-earth"
                          required
                          :error="!!poaFieldErrors?.country"
                          @update:model-value="formManager.validate('country')"
                        >
                          <template v-if="poaFieldErrors?.country" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.country }}</span>
                            </div>
                          </template>
                        </v-select>
                      </section>

                      <!-- Identification Section -->
                      <section class="mb-6">
                        <h2 class="text-h6 font-weight-semibold mb-4 primary-text">
                          Identification
                        </h2>
                        <v-select
                          v-model="poaFormData.id_type"
                          label="ID Type"
                          :items="idTypes"
                          placeholder="Select ID type"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-card-account-details-outline"
                          required
                          :error="!!poaFieldErrors?.id_type"
                          @update:model-value="formManager.validate('id_type')"
                        >
                          <template v-if="poaFieldErrors?.id_type" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.id_type }}</span>
                            </div>
                          </template>
                        </v-select>

                        <v-text-field
                          v-model="poaFormData.id_number"
                          label="ID Number"
                          :placeholder="getPlaceholderForIdType(poaFormData.id_type)"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-inner-icon="mdi-pound"
                          required
                          :error="!!poaFieldErrors?.id_number"
                          @blur="formManager.validate('id_number')"
                        >
                          <template v-if="poaFieldErrors?.id_number" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.id_number }}</span>
                            </div>
                          </template>
                        </v-text-field>
                      </section>

                      <!-- Document Upload Section -->
                      <section class="mb-6">
                        <h2 class="text-h6 font-weight-semibold mb-4 primary-text">
                          Document Uploads
                        </h2>
                        <p class="text-caption text-medium-emphasis mb-4">
                          Max file size: 5MB. Allowed types: PDF, JPG, PNG.
                        </p>

                        <v-file-input
                          v-model="poaFormData.id_document"
                          label="Upload ID Document"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-icon=""
                          prepend-inner-icon="mdi-file-upload-outline"
                          show-size
                          clearable
                          accept=".pdf,.jpg,.jpeg,.png"
                          :error="!!poaFieldErrors?.id_document"
                          @update:model-value="(file) => handleFileChange('id_document', file)"
                        >
                          <template v-if="poaFieldErrors?.id_document" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.id_document }}</span>
                            </div>
                          </template>
                        </v-file-input>

                        <v-file-input
                          v-model="poaFormData.power_of_attorney_document"
                          label="Upload Power of Attorney Document"
                          variant="outlined"
                          density="comfortable"
                          bg-color="grey-lighten-5"
                          prepend-icon=""
                          prepend-inner-icon="mdi-gavel"
                          show-size
                          clearable
                          accept=".pdf,.jpg,.jpeg,.png"
                          :error="!!poaFieldErrors?.power_of_attorney_document"
                          @update:model-value="
                            (file) => handleFileChange('power_of_attorney_document', file)
                          "
                        >
                          <template v-if="poaFieldErrors?.power_of_attorney_document" #details>
                            <div class="custom-error-container">
                              <v-icon size="small" color="error" class="mr-1">
                                mdi-alert-circle
                              </v-icon>
                              <span>{{ poaFieldErrors.power_of_attorney_document }}</span>
                            </div>
                          </template>
                        </v-file-input>
                      </section>

                      <!-- Skip Option -->
                      <v-row class="mb-2">
                        <v-col cols="12" class="d-flex justify-center">
                          <v-btn
                            color="grey-darken-1"
                            variant="text"
                            class="text-none"
                            size="small"
                            :disabled="onboardingStore.isLoading"
                            @click="handleSkipPowerOfAttorney"
                          >
                            Skip for Now
                          </v-btn>
                        </v-col>
                      </v-row>

                      <!-- Navigation Buttons -->
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-btn
                            block
                            color="secondary"
                            variant="flat"
                            :disabled="onboardingStore.isLoading"
                            height="48"
                            @click="navigateToPrevious"
                          >
                            Back
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-btn
                            block
                            color="primary"
                            type="submit"
                            :loading="onboardingStore.isLoading"
                            height="48"
                            variant="flat"
                          >
                            {{ onboardingStore.isLoading ? 'Submitting...' : 'Next' }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
                <div class="text-center mt-8 pb-4">
                  <span class="text-caption text-medium-emphasis d-block mb-1">Powered by</span>
                  <v-img
                    :src="bigLogo"
                    alt="Powered By Big Logo"
                    class="mx-auto"
                    width="120"
                    height="40"
                    contain
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
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
import { onMounted, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { usePoaFormManager } from '@/features/onboarding/composables/usePoaFormManager.js';
import { useDemoStore } from '@/store/demoStore';
import { countryList } from '@/features/onboarding/constants/address-options.js';
import { relationshipOptions, idTypes } from '@/features/onboarding/constants/poa-options.js';
import bigLogo from '@/assets/bigLogo.png';
import SimpleStepper from '@/components/ui/SimpleStepper.vue';
import { useCompleteOnboardingStepper } from '@/composables/useCompleteOnboardingStepper.js';
import { COMPLETE_ONBOARDING_STEPS } from '@/composables/useCompleteOnboardingStepper.js';

// Assets
import logoImage from '@/assets/Logo1.png';

const router = useRouter();
const onboardingStore = useOnboardingStore();
const formManager = usePoaFormManager();
const demoStore = useDemoStore();

// Initialize stepper for progress tracking
const { completedSteps, currentStepNumber, markStepComplete, navigateToStep } =
  useCompleteOnboardingStepper();

// Stepper event handlers
const handleStepChange = (newStep) => {
  console.log('Step changed to:', newStep);
};

const handleStepClick = (stepIndex) => {
  navigateToStep(stepIndex);
};

// Initialize reactive refs for watched values with proper defaults
const poaFormData = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  dob: '',
  gender: null,
  email: '',
  phone: '',
  relationship_to_principal: null,
  address_line_1: '',
  address_line_2: '',
  city: '',
  country: null,
  id_type: null,
  id_number: '',
  id_document: null,
  power_of_attorney_document: null,
});

const poaFieldErrors = ref({});
const poaFormAlert = ref(null);

// Watch for changes in form data and errors
watch(
  () => formManager?.formData?.value,
  (newVal) => {
    if (newVal) {
      // Preserve file objects when updating form data
      const currentFiles = {
        id_document: poaFormData.value.id_document,
        power_of_attorney_document: poaFormData.value.power_of_attorney_document,
      };
      poaFormData.value = { ...newVal, ...currentFiles };
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => formManager?.fieldErrors?.value,
  (newVal) => {
    if (newVal) {
      poaFieldErrors.value = { ...newVal };
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => formManager?.serverError?.value,
  (newVal) => {
    poaFormAlert.value = newVal;
  },
  { immediate: true }
);

const getPlaceholderForIdType = (idType) => {
  if (!idType) return 'Enter ID number';
  switch (idType) {
    case 'National ID':
      return 'Enter 6-11 digit ID number';
    case "Driver's License":
      return 'Enter 10 alphanumeric characters';
    case 'Passport':
      return 'Enter 8 alphanumeric characters';
    default:
      return 'Enter ID number';
  }
};

const handleSubmit = async () => {
  try {
    if (!formManager) {
      console.error('Form manager is not initialized');
      return;
    }

    formManager.clearErrors();
    onboardingStore.apiSubmitError = null;
    onboardingStore.apiFieldErrors = {};

    // Validate that at least one document is uploaded
    if (!poaFormData.value.power_of_attorney_document && !poaFormData.value.id_document) {
      onboardingStore.apiSubmitError =
        'At least one document (ID or Power of Attorney) is required.';
      return;
    }

    const isValid = await formManager.validate();
    if (!isValid) {
      if (
        !Object.values(formManager.fieldErrors?.value || {}).some((err) => err) &&
        !formManager.serverError?.value
      ) {
        onboardingStore.apiSubmitError = 'Please correct the errors in the form.';
      }
      return;
    }

    // Log the form data before submission
    console.log('Submitting form data:', {
      ...poaFormData.value,
      id_document: poaFormData.value.id_document?.name,
      power_of_attorney_document: poaFormData.value.power_of_attorney_document?.name,
    });

    // Create a copy of the form data to ensure we're passing the actual File objects
    const formDataToSubmit = {
      ...poaFormData.value,
      power_of_attorney_document: poaFormData.value.power_of_attorney_document,
      id_document: poaFormData.value.id_document,
    };

    const result = await onboardingStore.submitPowerOfAttorneyAction(formDataToSubmit);

    if (result.success) {
      markStepComplete('powerofattorney');
      formManager.clearPersistedFormData();
      formManager.clearBeforeUnloadWarning();
      router.push('/branch');
    } else {
      if (result.fieldMessages) {
        // Apply errors to both file fields if power_of_attorney_files has an error
        for (const key in result.fieldMessages) {
          if (key === 'power_of_attorney_document' || key === 'id_document') {
            if (formManager.fieldErrors?.value) {
              formManager.fieldErrors.value[key] = result.fieldMessages[key];
            }
          }
        }
      }
      if (
        result.generalMessage &&
        !onboardingStore.apiSubmitError &&
        !Object.values(formManager.fieldErrors?.value || {}).some((e) => e)
      ) {
        onboardingStore.apiSubmitError = result.generalMessage;
      }
      if (
        !onboardingStore.apiSubmitError &&
        !Object.values(formManager.fieldErrors?.value || {}).some((e) => e) &&
        !formManager.serverError?.value
      ) {
        onboardingStore.apiSubmitError =
          'Submission failed. Please review your information or try again later.';
      }
    }
  } catch (error) {
    console.error('Error in handleSubmit:', error);
    onboardingStore.apiSubmitError = 'An unexpected error occurred. Please try again later.';
  }
};

const handleSkipPowerOfAttorney = () => {
  markStepComplete('powerofattorney');
  onboardingStore.skipPowerOfAttorneyAction();
  formManager.clearPersistedFormData();
  formManager.clearBeforeUnloadWarning();
  router.push('/branch');
};

const navigateToPrevious = () => {
  // Logic to save current state if needed, or simply navigate.
  // Form manager handles beforeunload warning for unsaved changes.
  router.push('/designation-of-beneficiary'); // Or the actual previous route
};

onMounted(() => {
  if (!demoStore.signupId) {
    router.push('/basic-info'); // Redirect if signup process hasn't started
    return;
  }
  // formManager.loadPersistedData(); // This is called within usePoaFormManager's onMounted
  onboardingStore.apiSubmitError = null;
  onboardingStore.apiFieldErrors = {};
  formManager.clearErrors();
});

// Watch for API field errors from the store and update formManager's errors
watch(
  () => onboardingStore.apiFieldErrors,
  (newErrors) => {
    if (newErrors && Object.keys(newErrors).length > 0) {
      for (const key in newErrors) {
        formManager.fieldErrors.value[key] = newErrors[key];
      }
    }
  },
  { deep: true }
);

// Clear general API error when form data changes (user starts typing)
watch(
  formManager.formData,
  () => {
    if (onboardingStore.apiSubmitError) {
      onboardingStore.apiSubmitError = null;
    }
  },
  { deep: true }
);

// Generic file input handler: first argument is the field name, second is the File (or File[] / null)
const handleFileChange = (fieldName, file) => {
  const selectedFile = Array.isArray(file) ? file[0] : file;

  if (selectedFile instanceof File) {
    poaFormData.value[fieldName] = selectedFile;
    // Clear any existing error on this field
    if (formManager.fieldErrors?.value && formManager.fieldErrors.value[fieldName]) {
      formManager.fieldErrors.value[fieldName] = null;
    }
    console.log(`File selected for ${fieldName}:`, selectedFile);
  } else {
    // If no file selected (cleared), reset the value
    poaFormData.value[fieldName] = null;
  }
};
</script>

<style scoped>
/* Stepper styles */
.power-of-attorney-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.stepper-container {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  justify-content: center; /* Center the content horizontally */
}

.form-container {
  width: 100%;
  max-width: 800px; /* Max width for the form content itself */
  padding-top: 3rem; /* More padding at the top */
  padding-bottom: 3rem;
}

.form-card {
  background-color: white;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.primary-text {
  color: var(--v-primary-base);
}

/* Consistent input field styling */
:deep(.v-text-field .v-input__control),
:deep(.v-select .v-input__control),
:deep(.v-autocomplete .v-input__control),
:deep(.v-file-input .v-input__control) {
  border-radius: 8px; /* Standardized border radius */
}

:deep(.v-text-field--outlined fieldset),
:deep(.v-select--outlined fieldset),
:deep(.v-autocomplete--outlined fieldset),
:deep(.v-file-input--outlined fieldset) {
  border-color: rgba(0, 0, 0, 0.23); /* Consistent border color */
}

:deep(.v-btn) {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.text-error {
  /* Vuetify 3 uses this class for errors */
  color: rgb(var(--v-theme-error));
}

.section-title {
  /* For consistency if re-added */
  color: var(--v-primary-darken1);
  border-bottom: 2px solid var(--v-primary-lighten1);
  padding-bottom: 0.5rem;
}

@media (max-width: 959px) {
  /* md breakpoint */
  .form-container {
    padding: 2rem;
  }
}

@media (max-width: 600px) {
  /* sm breakpoint */
  .form-container {
    padding: 1.5rem;
  }
  .text-h4 {
    font-size: 1.75rem !important; /* Adjust title for smaller screens */
  }
  .text-subtitle-1 {
    font-size: 0.9rem !important;
  }
  .form-card {
    padding: 1rem;
  }
  :deep(.v-card-text) {
    padding: 1rem !important;
  }
}
</style>
