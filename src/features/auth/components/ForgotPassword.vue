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
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Reset Password</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Recover access to your account</p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert v-if="manager.errorMessage.value" type="error" variant="tonal" class="mb-4">
                    {{ manager.errorMessage.value }}
                  </v-alert>

                  <v-alert v-if="manager.successMessage.value" type="success" variant="tonal" class="mb-4">
                    {{ manager.successMessage.value }}
                  </v-alert>

                  <!-- Step 1: Email input -->
                  <v-form v-if="!manager.isCodeSent.value" @submit.prevent="manager.submitEmail">
                    <v-text-field
                      v-model="manager.emailField.value"
                      label="Email"
                      placeholder="Enter your registered email"
                      variant="outlined"
                      prepend-inner-icon="mdi-email"
                      required
                      :error-messages="manager.emailError.value"
                      @blur="manager.validateStep1"
                    />
                    <v-btn block color="primary" size="large" type="submit" :loading="manager.isLoading.value" class="reset-button mb-4">
                      {{ manager.isLoading.value ? 'Sending...' : 'Reset Password' }}
                    </v-btn>
                  </v-form>

                  <!-- Step 2: Verification and new password -->
                  <v-form v-else @submit.prevent="manager.submitNewPassword">
                    <v-text-field
                      v-model="manager.verificationCode.value"
                      label="Verification Code"
                      placeholder="Enter code from your email"
                      variant="outlined"
                      prepend-inner-icon="mdi-shield-key"
                      required
                    />
                    <v-text-field
                      v-model="manager.newPassword.value"
                      label="New Password"
                      :type="manager.showPassword.value ? 'text' : 'password'"
                      placeholder="Enter new password"
                      variant="outlined"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="manager.showPassword.value ? 'mdi-eye' : 'mdi-eye-off'"
                      required
                      :error-messages="manager.passwordError.value"
                      @click:append-inner="manager.showPassword.value = !manager.showPassword.value"
                      @blur="manager.validateStep2"
                    />
                    <v-text-field
                      v-model="manager.confirmPassword.value"
                      label="Confirm Password"
                      :type="manager.showPassword.value ? 'text' : 'password'"
                      placeholder="Confirm new password"
                      variant="outlined"
                      prepend-inner-icon="mdi-lock-check"
                      required
                      :error-messages="manager.confirmPasswordError.value"
                      @click:append-inner="manager.showPassword.value = !manager.showPassword.value"
                       @blur="manager.validateStep2"
                    />
                    <v-row class="mt-2">
                      <v-col cols="12" class="text-center mb-4">
                        <v-btn variant="text" color="primary" :loading="manager.isResending.value" @click="manager.handleResendCode">
                            {{ manager.isResending.value ? 'Sending...' : 'Resend Code' }}
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="1" order-sm="2">
                        <v-btn block color="primary" variant="flat" size="large" type="submit" :loading="manager.isLoading.value">
                          {{ manager.isLoading.value ? 'Resetting...' : 'Reset Password' }}
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" order="2" order-sm="1" class="mt-2 mt-sm-0">
                        <v-btn block color="secondary" variant="flat" size="large" @click="manager.navigateToLogin">
                          Back to Login
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

<script setup lang="ts">
import { useForgotPasswordManager } from '@/features/auth/composables/useForgotPasswordManager.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const manager = useForgotPasswordManager();
</script>

<style scoped>
.form-section {
  background: #f9fafc;
  min-height: 100vh;
  overflow-y: auto;
}

.form-container {
  max-width: 100%;
  padding: 2rem 1rem;
}

.form-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.primary-text {
  color: var(--v-primary-base, #1976d2);
}

:deep(.v-field) {
  border-radius: 8px !important;
  box-shadow: none !important;
}

:deep(.v-field__outline) {
  opacity: 1 !important;
}

.reset-button {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.logo-image {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 4px;
  z-index: 4;
  position: relative;
}

@media (max-width: 600px) {
  .form-section {
    height: auto;
    min-height: 100vh;
  }

  .form-container {
    padding: 1rem;
    height: auto;
  }

  .form-card {
    padding: 0.5rem;
    border-radius: 12px;
  }
}
</style>
