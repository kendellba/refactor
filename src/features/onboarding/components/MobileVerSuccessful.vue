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
                  Your mobile number has been verified successfully
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
                  <p class="text-h6 mb-6">Mobile Verification Successful</p>

                  <v-btn
                    block
                    color="primary"
                    variant="elevated"
                    height="44"
                    @click="router.push({ name: 'MembershipDeclarationAgreement' })"
                  >
                    Next
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
import { useRouter } from 'vue-router';
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';

const router = useRouter();
</script>

<style scoped>
.form-section {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.form-section::-webkit-scrollbar {
  display: none;
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

:deep(.v-btn) {
  height: 54px;
  border-radius: 14px;
  font-weight: 600;
  letter-spacing: 0.25px;
  text-transform: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgb(var(--v-theme-primary));
  color: white;
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.25);
}

:deep(.v-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(25, 118, 210, 0.35);
}

:deep(.v-btn:active) {
  transform: translateY(0);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.2);
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



.brand-logo {
  z-index: 2;
  max-width: 300px;
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

  .brand-section {
    position: relative;
    width: 100%;
    min-height: 300px;
  }

  .brand-logo {
    width: 180px;
  }

  :deep(.v-btn) {
    height: 50px;
    border-radius: 12px;
  }
}
</style> 