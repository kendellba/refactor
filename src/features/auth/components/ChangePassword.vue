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
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Create New Password</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Set a new password for your account
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert v-if="manager.errorMessage.value" type="error" variant="tonal" class="mb-4">
                    {{ manager.errorMessage.value }}
                  </v-alert>

                  <v-alert v-if="manager.successMessage.value" type="success" variant="tonal" class="mb-4">
                    {{ manager.successMessage.value }}
                  </v-alert>

                  <v-form @submit.prevent="manager.submitChangePassword">
                    <v-text-field
                      v-model="manager.newPassword.value"
                      label="New Password"
                      :type="manager.showPassword.value ? 'text' : 'password'"
                      placeholder="Enter new password"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="manager.showPassword.value ? 'mdi-eye' : 'mdi-eye-off'"
                      required
                      :error-messages="manager.passwordError.value"
                      @input="manager.validate"
                      @click:append-inner="manager.showPassword.value = !manager.showPassword.value"
                    >
                      <template v-if="manager.passwordError.value" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ manager.passwordError.value }}</span>
                        </div>
                      </template>
                    </v-text-field>

                    <!-- Password strength indicator -->
                    <PasswordStrengthMeter :strength="manager.passwordStrength.value" />

                    <v-text-field
                      v-model="manager.confirmPassword.value"
                      label="Confirm Password"
                      :type="manager.showPassword.value ? 'text' : 'password'"
                      placeholder="Confirm your new password"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-lock-check"
                      :append-inner-icon="manager.showPassword.value ? 'mdi-eye' : 'mdi-eye-off'"
                      required
                      :error-messages="manager.confirmPasswordError.value"
                      @input="manager.validate"
                      @click:append-inner="manager.showPassword.value = !manager.showPassword.value"
                    >
                      <template v-if="manager.confirmPasswordError.value" #details>
                        <div class="custom-error-container">
                          <v-icon size="small" color="error" class="mr-1">
                            mdi-alert-circle
                          </v-icon>
                          <span>{{ manager.confirmPasswordError.value }}</span>
                        </div>
                      </template>
                    </v-text-field>

                    <v-row class="mt-6">
                      <v-col cols="12" sm="6" order="2" order-sm="1">
                        <v-btn
                          block
                          color="secondary"
                          variant="flat"
                          size="large"
                          @click="manager.navigateToLogin"
                        >
                          Cancel
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="1" order-sm="2">
                        <v-btn
                          block
                          color="primary"
                          variant="flat"
                          size="large"
                          type="submit"
                          :loading="manager.isLoading.value"
                          :disabled="!manager.isFormValid.value"
                        >
                          {{ manager.isLoading.value ? 'Processing...' : 'Change Password' }}
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

      <!-- Brand Section -->
      <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
        <div class="brand-overlay"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useChangePasswordManager } from '@/features/auth/composables/useChangePasswordManager.js';
import PasswordStrengthMeter from '@/components/ui/PasswordStrengthMeter.vue';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const manager = useChangePasswordManager();
</script>

<style scoped>
.form-section {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
}

.form-container {
  max-width: 100%;
  padding: 2rem 1rem;
}

.form-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.brand-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background: linear-gradient(
    45deg,
    rgba(25, 118, 210, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(25, 118, 210, 0.1) 50%,
    rgba(25, 118, 210, 0.1) 75%,
    transparent 75%
  );
  background-size: 20px 20px;
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-btn) {
  height: 48px;
  border-radius: 8px;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .form-section {
    height: auto;
    min-height: 100vh;
  }

  .form-container {
    padding: 1rem;
  }

  .form-card {
    padding: 0.5rem;
  }
}
</style>
