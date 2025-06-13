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

                <h1 class="text-h4 font-weight-bold primary-text mb-2">Congratulations</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Your email has been verified successfully
                </p>
              </div>

              <v-card class="form-card text-center" elevation="0" rounded="lg">
                <v-card-text>
                  <v-img
                    src="@/assets/Group 5.png"
                    alt="Verification Image"
                    class="mx-auto mb-4"
                    max-width="200"
                    contain
                  />
                  <p class="text-h6 mb-6">Verified Email Successfully</p>

                  <v-btn
                    block
                    color="primary"
                    variant="elevated"
                    :loading="isLoading"
                    height="44"
                    @click="handleNext"
                  >
                    {{
                      isLoading ? 'Processing...' : isLoginVerification ? 'Go to Dashboard' : 'Next'
                    }}
                  </v-btn>
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
import { ref, onMounted, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const router = useRouter();
const authStore = useAuthStore();
const isLoading: Ref<boolean> = ref(false);
const isLoginVerification: Ref<boolean> = ref(false);

onMounted(() => {
  // Check verification source from sessionStorage
  const verificationSource = sessionStorage.getItem('verificationSource');
  isLoginVerification.value = verificationSource === 'login';

  // Clear the session storage
  sessionStorage.removeItem('verificationSource');

  // If this was from login, also clear the verifyingEmail
  if (isLoginVerification.value) {
    sessionStorage.removeItem('verifyingEmail');

    // Ensure we have a valid JWT token
    if (!authStore.jwtToken) {
      console.error('No JWT token found after verification');
      // Handle this edge case - could redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }
});

const handleNext = async (): Promise<void> => {
  isLoading.value = true;

  try {
    // Clear verification session data
    sessionStorage.removeItem('verificationSource');
    sessionStorage.removeItem('verifyingEmail');

    if (isLoginVerification.value) {
      // For login flow, go directly to dashboard
      await router.push('/dashboard');
    } else {
      // For signup flow, continue to mobile verification
      router.push('/mobile-verification');
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to login page
    router.push('/login');
  } finally {
    isLoading.value = false;
  }
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
  display: flex;
  align-items: center;
  height: 100%;
}

.brand-logo {
  z-index: 2;
  max-width: 300px;
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