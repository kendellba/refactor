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

                <h1 class="text-h4 font-weight-bold primary-text mb-2">Getting Ready</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Please prepare the following documents
                </p>
              </div>

              <v-card class="form-card" elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert type="info" variant="tonal" class="mb-6" icon="mdi-information">
                    To complete your application, you'll need to have the following documents ready
                    for upload.
                  </v-alert>

                  <!-- Document Requirements Cards -->
                  <div class="document-grid mb-6">
                    <v-card
                      v-for="(item, index) in items"
                      :key="index"
                      class="document-card"
                      variant="outlined"
                      rounded="lg"
                    >
                      <v-card-item>
                        <template #prepend>
                          <v-icon
                            :icon="item.icon"
                            color="primary"
                            size="large"
                            class="mr-2"
                          ></v-icon>
                        </template>
                        <v-card-title class="text-body-1 font-weight-bold">{{
                          item.title
                        }}</v-card-title>
                      </v-card-item>

                      <v-card-text class="pt-0">
                        <p class="text-body-2">{{ item.description }}</p>
                      </v-card-text>
                    </v-card>
                  </div>

                  <v-row>
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
                        height="44"
                        class="next-button"
                        append-icon="mdi-arrow-right"
                        @click="navigateToNext"
                      >
                        Next
                      </v-btn>
                    </v-col>
                  </v-row>
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
import { GETTING_READY_ITEMS } from '@/features/onboarding/constants/getting-ready-options.js';

const router = useRouter();

const navigateToNext = (): void => {
  router.push('/basic-info');
};

const navigateToPrevious = (): void => {
  router.go(-1);
};

// Use the imported constant
const items = GETTING_READY_ITEMS;
</script>

<style scoped>
.form-section {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.form-section::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.form-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2.5rem 1.5rem;
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.document-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 2rem;
  height: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.document-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.primary-text {
  color: var(--v-primary-base);
  font-size: 2.25rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
  font-weight: 700;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

:deep(.v-card-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 0.75rem;
}

:deep(.v-card-text) {
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.6;
}

:deep(.v-icon) {
  color: var(--v-primary-base);
  font-size: 2rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.document-card:hover :deep(.v-icon) {
  transform: scale(1.1);
  color: var(--v-primary-darken1);
}

:deep(.v-btn) {
  height: 54px;
  border-radius: 14px;
  font-weight: 600;
  letter-spacing: 0.25px;
  text-transform: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.next-button {
  position: relative;
}

:deep(.next-button.v-btn) {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

:deep(.next-button .v-btn__content) {
  color: white;
  font-weight: 600;
}

:deep(.next-button .v-btn__append) {
  color: white;
}

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.35);
}

.next-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
}

.back-button {
  position: relative;
}

:deep(.back-button.v-btn) {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.8);
}

:deep(.back-button:hover) {
  background-color: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
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

@media (max-width: 959px) {
  .form-container {
    padding: 2rem 1.25rem;
  }

  .document-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
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

  .document-card {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .primary-text {
    font-size: 2rem;
  }

  :deep(.v-card-title) {
    font-size: 1.125rem;
  }

  :deep(.v-icon) {
    font-size: 1.75rem;
  }

  :deep(.v-btn) {
    height: 50px;
    border-radius: 12px;
  }
}
</style> 