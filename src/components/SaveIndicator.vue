<template>
  <transition name="save-indicator">
    <v-chip
      v-if="showIndicator"
      :color="status.color"
      :variant="variant"
      size="small"
      class="save-indicator"
      :class="{ 'save-indicator--floating': floating }"
    >
      <v-icon 
        :icon="status.icon" 
        size="16" 
        class="mr-1"
        :class="{ 'animate-spin': status.icon === 'mdi-loading' }"
      />
      {{ status.text }}
      
      <template v-if="lastSaved && status.color === 'success'">
        <span class="text-caption ml-1">
          ({{ timeAgo }})
        </span>
      </template>
    </v-chip>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue';
import type { SaveStatus, DateOrNumber, VuetifyVariant } from '../types';

interface Props {
  isDirty?: boolean;
  isSaving?: boolean;
  lastSaved?: DateOrNumber | null;
  saveError?: string | null;
  floating?: boolean;
  variant?: VuetifyVariant;
  autoHide?: boolean;
  hideDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  saveError: null,
  floating: false,
  variant: 'tonal',
  autoHide: true,
  hideDelay: 3000
});

const showIndicator: Ref<boolean> = ref(false);
let hideTimeout: NodeJS.Timeout | null = null;
let timeUpdateInterval: NodeJS.Timeout | null = null;

const status = computed((): SaveStatus => {
  if (props.isSaving) {
    return { 
      text: 'Saving...', 
      color: 'info', 
      icon: 'mdi-loading'
    };
  }
  
  if (props.saveError) {
    return { 
      text: 'Save failed', 
      color: 'error', 
      icon: 'mdi-alert-circle'
    };
  }
  
  if (props.lastSaved) {
    return { 
      text: 'Saved', 
      color: 'success', 
      icon: 'mdi-check-circle'
    };
  }
  
  if (props.isDirty) {
    return { 
      text: 'Unsaved changes', 
      color: 'warning', 
      icon: 'mdi-content-save-alert'
    };
  }
  
  return { 
    text: 'Up to date', 
    color: 'success', 
    icon: 'mdi-check'
  };
});

const timeAgo = computed((): string => {
  if (!props.lastSaved) return '';
  
  const now = new Date();
  const saved = new Date(props.lastSaved);
  const diffMs = now.getTime() - saved.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffSec < 30) return 'just now';
  if (diffMin < 1) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ago`;
});

const updateIndicatorVisibility = (): void => {
  // Always show if there's an error or if saving
  if (props.saveError || props.isSaving) {
    showIndicator.value = true;
    if (hideTimeout) clearTimeout(hideTimeout);
    return;
  }
  
  // Show if there are unsaved changes
  if (props.isDirty) {
    showIndicator.value = true;
    if (hideTimeout) clearTimeout(hideTimeout);
    return;
  }
  
  // Show briefly after save, then auto-hide
  if (props.lastSaved) {
    showIndicator.value = true;
    
    if (props.autoHide) {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        showIndicator.value = false;
      }, props.hideDelay);
    }
    return;
  }
  
  // Default: hide
  showIndicator.value = false;
};

// Watch for prop changes
watch([
  () => props.isDirty,
  () => props.isSaving,
  () => props.lastSaved,
  () => props.saveError
], updateIndicatorVisibility, { immediate: true });

onMounted(() => {
  // Update time display every 30 seconds
  timeUpdateInterval = setInterval(() => {
    // Force reactivity update - the computed will re-evaluate
  }, 30000);
});

onBeforeUnmount(() => {
  if (hideTimeout) clearTimeout(hideTimeout);
  if (timeUpdateInterval) clearInterval(timeUpdateInterval);
});
</script>

<style scoped>
.save-indicator {
  transition: all 0.3s ease;
  user-select: none;
}

.save-indicator--floating {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.save-indicator-enter-active,
.save-indicator-leave-active {
  transition: all 0.3s ease;
}

.save-indicator-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.save-indicator-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 768px) {
  .save-indicator--floating {
    top: 60px;
    right: 16px;
  }
}
</style> 