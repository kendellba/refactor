<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <!-- Form Section -->
      <v-col cols="12" md="6" class="form-section">
        <v-container class="form-container">
          <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" sm="10" md="10" lg="9">
              <v-card class="form-card text-center" elevation="0" rounded="lg">
                <v-card-text>
                  <v-img
                    :src="logoImage"
                    alt="Cathedral Engage"
                    class="mx-auto mb-4"
                    width="100"
                    height="100"
                  />
                  <v-icon icon="mdi-alert-circle" color="error" size="64" class="mb-4" />

                  <h1 class="text-h3 font-weight-bold mb-4">404</h1>
                  <h2 class="text-h5 mb-4">Page Not Found</h2>
                  <p class="text-body-1 text-medium-emphasis mb-6">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <v-btn
                    block
                    color="primary"
                    variant="elevated"
                    size="large"
                    height="44"
                    @click="$router.push('/')"
                  >
                    Return to Home
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
import logoImage from '@/assets/Logo1.png';
import bigLogo from '@/assets/bigLogo.png';
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
  justify-content: center;
  align-items: center;
}

.brand-logo {
  position: relative;
  z-index: 2;
  max-width: 300px;
}

:deep(.v-btn) {
  height: 48px;
  border-radius: 8px;
}

:deep(.v-card) {
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border-radius: 12px;
}

:deep(.v-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Mobile specific styles */
@media (max-width: 959px) {
  .form-container {
    padding: 1rem;
  }

  .brand-section {
    display: none;
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
