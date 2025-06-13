<template>
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
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Account Number</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Please enter your account number</p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-form @submit.prevent="handleSubmit">
                    <v-alert v-if="onboardingStore.apiSubmitError" type="error" variant="tonal" class="mb-4">
                      {{ onboardingStore.apiSubmitError }}
                    </v-alert>

                    <v-text-field
                      v-model="formManager.formData.value.account_number"
                      label="Account Number"
                      placeholder="Enter your account number"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-bank"
                      :error-messages="formManager.fieldErrors.value.account_number"
                      @blur="formManager.validateField && formManager.validateField('account_number')"
                      required
                    >
                      <template #details> For testing, use account number: 1234567890 </template>
                    </v-text-field>

                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          variant="flat"
                          height="44"
                          class="back-button"
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
                          type="submit"
                          :loading="onboardingStore.isLoading"
                          height="44"
                          class="next-button"
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import { useAccountNumberFormManager } from '@/features/onboarding/composables/useAccountNumberFormManager.js';
import { useDemoStore } from '@/store/demoStore';
import type { AccountNumberFormData } from '@/types';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const router = useRouter();
const onboardingStore = useOnboardingStore();
const demoStore = useDemoStore() as any; // Type assertion for store methods
const formManager = useAccountNumberFormManager() as any;

const handleSubmit = async (): Promise<void> => {
  formManager.clearErrors();
  onboardingStore.apiSubmitError = null;

  const result = await formManager.validate(formManager.formData.value);
  if (!result.isValid) {
    return;
  }
  
  // NOTE: Store action would be called here.
  // const result = await onboardingStore.verifyAccountNumberAction(formManager.formData.value);
  
  // Simulating success for now
  const submitResult = { success: true } as {
    success: boolean;
    fieldMessages?: any;
    generalMessage?: string;
  };

  if (submitResult.success) {
    demoStore.$patch({
      accountNumber: formManager.formData.value.account_number,
    });
    router.push('/due-diligence');
  } else {
    if (submitResult.fieldMessages) {
      formManager.fieldErrors.value = submitResult.fieldMessages;
    }
    if (submitResult.generalMessage) {
      onboardingStore.apiSubmitError = submitResult.generalMessage;
    }
  }
};

const navigateToPrevious = (): void => {
  router.go(-1);
};
</script>

<style scoped>
.form-section {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  height: 100vh;
  overflow-y: auto;
}

.form-container {
  max-width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
}

.brand-logo {
  z-index: 2;
  max-width: 300px;
}

.brand-section {
  position: relative;
  background: var(--v-primary-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-btn) {
  height: 48px;
  border-radius: 8px;
}

:deep(.v-card) {
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
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

  :deep(.v-card-text) {
    padding: 16px !important;
  }
}
</style>
