<template>
  <v-col cols="12" class="pa-6">
    <div class="text-h5 mb-6">Applications</div>
    <v-card>
      <v-card-text>
        <div class="text-center py-12">
          <v-icon size="64" color="primary" class="mb-4">mdi-file-document</v-icon>
          <div class="text-h6">Applications Dashboard</div>
          <div class="text-body-1 mt-2">This section is under development</div>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
interface Props {
  isMobile?: boolean;
}

withDefaults(defineProps<Props>(), {
  isMobile: false,
});
</script>
