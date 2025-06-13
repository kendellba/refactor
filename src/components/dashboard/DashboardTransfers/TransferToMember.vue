<template>
  <div>
    <!-- Mobile View -->
    <v-bottom-sheet v-if="isMobile" v-model="isOpen" scrollable>
      <v-card height="90vh">
        <v-toolbar color="primary" theme="dark">
          <template #prepend>
            <v-btn icon @click="closeForm">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <v-toolbar-title>Transfer to Member</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <div class="text-center py-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-account-group</v-icon>
            <div class="text-h6 text-grey">Member Transfer Form</div>
            <div class="text-body-1 text-grey mt-2">This feature is under development</div>

            <v-btn color="primary" variant="outlined" class="mt-6" @click="closeForm">
              Close
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <!-- Desktop View -->
    <v-card v-else variant="outlined" class="mb-4">
      <v-card-title class="py-3 bg-grey-lighten-4">
        <v-icon start>mdi-account-group</v-icon>
        Transfer to Member
      </v-card-title>

      <v-card-text>
        <div class="text-center py-8">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-account-group</v-icon>
          <div class="text-h6 text-grey">Member Transfer Form</div>
          <div class="text-body-1 text-grey mt-2">This feature is under development</div>

          <v-btn color="primary" variant="outlined" class="mt-6" @click="closeForm"> Close </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

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
const isOpen = ref(true);

const closeForm = () => {
  isOpen.value = false;
  emit('back');
};
</script>
