<template>
  <v-col cols="12" class="pa-6">
    <div class="text-h5 mb-6">Requests</div>
    <v-card>
      <v-card-text>
        <div class="text-center py-12">
          <v-icon size="64" color="primary" class="mb-4">mdi-clipboard-text</v-icon>
          <div class="text-h6">Requests Dashboard</div>
          <div class="text-body-1 mt-2">This section is under development</div>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});
</script>
