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
          <v-toolbar-title>Transfer to External Payee</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <div class="text-center py-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-bank-outline</v-icon>
            <div class="text-h6 text-grey">External Transfer Form</div>
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
        <v-icon start>mdi-bank-outline</v-icon>
        Transfer to External Payee
      </v-card-title>

      <v-card-text>
        <div class="text-center py-8">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-bank-outline</v-icon>
          <div class="text-h6 text-grey">External Transfer Form</div>
          <div class="text-body-1 text-grey mt-2">This feature is under development</div>
          <v-btn color="primary" variant="outlined" class="mt-6" @click="closeForm"> Close </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['back']);
const isOpen = ref(true);

const closeForm = () => {
  isOpen.value = false;
  emit('back');
};
</script>
