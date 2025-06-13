<template>
  <v-dialog 
    v-model="showDialog" 
    max-width="500" 
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="info" class="mr-3">mdi-content-save-alert</v-icon>
        <span>Unsaved Progress Found</span>
      </v-card-title>

      <v-card-text>
        <v-alert 
          type="info" 
          variant="tonal" 
          class="mb-4"
          density="compact"
        >
          We found unsaved changes from {{ formatTimestamp(lastSaved) }}.
        </v-alert>

        <p class="mb-4">
          Would you like to restore your previous progress or start fresh?
        </p>

        <!-- Auto-save Status -->
        <v-chip-group class="mb-4">
          <v-chip 
            size="small" 
            variant="outlined"
            prepend-icon="mdi-clock-outline"
          >
            Auto-saved {{ timeAgo(lastSaved) }}
          </v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="outlined"
          color="error"
          @click="startFresh"
          :loading="isClearing"
        >
          <v-icon start>mdi-delete</v-icon>
          Start Fresh
        </v-btn>

        <v-spacer />

        <v-btn
          variant="flat"
          color="primary"
          @click="restoreData"
          :loading="isRestoring"
        >
          <v-icon start>mdi-restore</v-icon>
          Restore Progress
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  lastSaved: {
    type: [Date, Number],
    default: null
  }
});

const emit = defineEmits([
  'restore',
  'clear',
  'close'
]);

const showDialog = ref(false);
const isRestoring = ref(false);
const isClearing = ref(false);

// Watch for show prop changes
watch(() => props.show, (newValue) => {
  showDialog.value = newValue;
});

// Methods
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
};

const timeAgo = (timestamp) => {
  if (!timestamp) return 'unknown time';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.round(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return `${Math.round(diffHours / 24)}d ago`;
};

const restoreData = async () => {
  try {
    isRestoring.value = true;
    emit('restore');
    await new Promise(resolve => setTimeout(resolve, 500));
    showDialog.value = false;
    emit('close');
  } catch (error) {
    console.error('Error restoring data:', error);
  } finally {
    isRestoring.value = false;
  }
};

const startFresh = async () => {
  try {
    isClearing.value = true;
    emit('clear');
    await new Promise(resolve => setTimeout(resolve, 500));
    showDialog.value = false;
    emit('close');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    isClearing.value = false;
  }
};
</script>

<style scoped>
.v-dialog .v-card {
  border-radius: 16px;
}
</style> 