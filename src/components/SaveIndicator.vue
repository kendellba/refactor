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

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  isDirty: {
    type: Boolean,
    default: false
  },
  isSaving: {
    type: Boolean,
    default: false
  },
  lastSaved: {
    type: [Date, Number],
    default: null
  },
  saveError: {
    type: String,
    default: null
  },
  floating: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'tonal'
  },
  autoHide: {
    type: Boolean,
    default: true
  },
  hideDelay: {
    type: Number,
    default: 3000
  }
});

const showIndicator = ref(false);
let hideTimeout = null;
let timeUpdateInterval = null;

const status = computed(() => {
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

const timeAgo = computed(() => {
  if (!props.lastSaved) return '';
  
  const now = new Date();
  const saved = new Date(props.lastSaved);
  const diffMs = now - saved;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffSec < 30) return 'just now';
  if (diffMin < 1) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ago`;
});

const updateIndicatorVisibility = () => {
  // Always show if there's an error or if saving
  if (props.saveError || props.isSaving) {
    showIndicator.value = true;
    clearTimeout(hideTimeout);
    return;
  }
  
  // Show if there are unsaved changes
  if (props.isDirty) {
    showIndicator.value = true;
    clearTimeout(hideTimeout);
    return;
  }
  
  // Show briefly after save, then auto-hide
  if (props.lastSaved) {
    showIndicator.value = true;
    
    if (props.autoHide) {
      clearTimeout(hideTimeout);
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
    // Force reactivity update
  }, 30000);
});

onBeforeUnmount(() => {
  clearTimeout(hideTimeout);
  clearInterval(timeUpdateInterval);
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