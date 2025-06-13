<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <!-- Form Section -->
      <v-col cols="12" md="6" class="form-section">
        <v-container class="form-container">
          <v-row justify="center" align="center">
            <v-col cols="12" sm="10" md="10" lg="9">
              <div class="text-center mb-4 mb-sm-8">
                <v-img
                  :src="logoImage"
                  alt="Cathedral Engage"
                  class="mx-auto mb-3"
                  width="80"
                  height="80"
                  :width-sm="100"
                  :height-sm="100"
                />
                <h1 class="text-h5 text-sm-h4 font-weight-bold primary-text mb-1 mb-sm-2">
                  Welcome to Cathedral Online
                </h1>
                <p class="text-subtitle-2 text-sm-subtitle-1 text-medium-emphasis">
                  Are you a new or existing customer?
                </p>
              </div>

              <v-card-text>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-btn
                      block
                      color="primary"
                      variant="flat"
                      size="large"
                      height="56"
                      class="mb-4"
                      @click="selectNewCustomer"
                    >
                      I'm a New Customer
                    </v-btn>

                    <v-btn
                      block
                      color="secondary"
                      variant="flat"
                      size="large"
                      height="56"
                      @click="selectExistingCustomer"
                    >
                      I'm an Existing Customer
                    </v-btn>
                  </v-col>
                </v-row>

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
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const router = useRouter();
const onboardingStore = useOnboardingStore();

const selectNewCustomer = (): void => {
  onboardingStore.setCustomerAsNew();
  router.push('/getting-ready');
};

const selectExistingCustomer = (): void => {
  onboardingStore.setCustomerAsExisting();
  router.push('/getting-ready');
};

onMounted(() => {
  onboardingStore.initializeCustomerType();
});
</script>

<style scoped>
.form-section {
  background: #f9fafc;
  min-height: 100vh;
  overflow-y: auto;
}

.form-container {
  max-width: 100%;
  padding: 1.5rem 1rem;
}

.form-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.primary-text {
  color: var(--v-primary-base, #1976d2);
}

:deep(.v-btn) {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
}

:deep(.v-btn.primary) {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

/* Brand section styles */

.brand-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.brand-logo {
  position: relative;
  z-index: 2;
  max-width: 80%;
  max-height: 80%;
}

@media (max-width: 600px) {
  .form-section {
    height: auto;
    min-height: 100vh;
  }

  .form-container {
    padding: 1rem 0.75rem;
    height: auto;
  }

  .form-card {
    padding: 0.25rem;
    border-radius: 12px;
  }
}
</style> 