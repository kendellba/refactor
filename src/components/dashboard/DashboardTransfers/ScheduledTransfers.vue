<template>
  <div>
    <v-bottom-sheet v-if="isMobile" v-model="isOpen" scrollable>
      <v-card height="90vh">
        <v-toolbar color="primary" theme="dark">
          <template #prepend>
            <v-btn icon @click="closeForm">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <v-toolbar-title>Scheduled Transfers</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <div class="text-center py-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-calendar-clock</v-icon>
            <div class="text-h6 text-grey">Scheduled Transfers</div>
            <div class="text-body-1 text-grey mt-2">This feature is under development</div>
            <v-btn color="primary" variant="outlined" class="mt-6" @click="closeForm">
              Close
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-card v-else variant="outlined" class="mb-4">
      <v-card-title class="py-3 bg-grey-lighten-4">
        <v-icon start>mdi-calendar-clock</v-icon>
        Scheduled Transfers
      </v-card-title>

      <v-card-text>
        <div class="text-center py-8">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-calendar-clock</v-icon>
          <div class="text-h6 text-grey">Scheduled Transfers</div>
          <div class="text-body-1 text-grey mt-2">This feature is under development</div>
          <v-btn color="primary" variant="outlined" class="mt-6" @click="closeForm"> Close </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

interface Props {
  isMobile?: boolean;
}

interface Emits {
  'back': [];
}

withDefaults(defineProps<Props>(), {
  isMobile: false,
});

const emit = defineEmits<Emits>();
const isOpen: Ref<boolean> = ref(true);

const closeForm = (): void => {
  isOpen.value = false;
  emit('back');
};
</script>
