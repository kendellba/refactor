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
                <h1 class="text-h4 font-weight-bold primary-text mb-2">Welcome Back</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Log in to your account</p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
                    {{ errorMessage }}
                  </v-alert>

                  <v-form @submit.prevent="handleLoginSubmit">
                    <v-text-field
                      v-model="formData.email"
                      label="Email"
                      placeholder="Enter your email"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-email"
                      required
                      :error-messages="errors.email"
                      @input="() => { if(errors.email) validateField('email'); }"
                      @blur="() => validateField('email')"
                    />

                    <v-text-field
                      v-model="formData.password"
                      label="Password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Enter your password"
                      variant="outlined"
                      density="comfortable"
                      bg-color="grey-lighten-5"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      required
                      :error-messages="errors.password"
                      @click:append-inner="showPassword = !showPassword"
                      @blur="() => validateField('password')"
                    />

                    <div class="d-flex justify-end align-center mb-6">
                      <v-btn
                        variant="text"
                        color="primary"
                        class="text-caption"
                        @click="forgotPassword"
                      >
                        Forgot Password?
                      </v-btn>
                    </div>

                    <v-btn
                      block
                      color="primary"
                      size="large"
                      variant="flat"
                      height="50"
                      type="submit"
                      :loading="isLoading"
                      class="login-button mb-4"
                    >
                      {{ isLoading ? 'Logging in...' : 'Log In' }}
                    </v-btn>

                    <div class="text-center">
                      <p class="text-body-2 text-medium-emphasis">
                        Don't have an account?
                        <v-btn
                          variant="text"
                          color="primary"
                          class="px-2 text-decoration-underline"
                          @click="navigateToSignup"
                        >
                          Sign up
                        </v-btn>
                      </p>
                    </div>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <div class="text-center mt-6 pb-4">
          <span class="text-caption text-medium-emphasis d-block mb-2">Powered by</span>
        </div>
        <v-img
          :src="bigLogo"
          alt="Powered By"
          class="mx-auto logo-image"
          width="150"
          height="50"
          contain
        />
      </v-col>

      <!-- Brand Section -->
      <v-col cols="12" md="6" class="brand-section d-none d-md-flex">
        <div class="brand-overlay"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { watch } from 'vue';
import { useLoginFormManager } from '@/features/auth/composables/useLoginFormManager.js';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const {
  formData,
  showPassword,
  errors,
  isLoading,
  errorMessage,
  handleLoginSubmit,
  forgotPassword,
  navigateToSignup,
  validateField,
} = useLoginFormManager();

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

.login-button {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
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