<template>
  <div class="onboarding-stepper">
    <!-- Desktop Stepper -->
    <v-stepper 
      v-if="!isMobile"
      v-model="currentStepNumber"
      :items="stepItems"
      class="stepper-container"
      hide-actions
      flat
    >
      <template v-for="(step, index) in steps" :key="step.route" #[`item.${index + 1}`]="{ item }">
        <v-stepper-item
          :value="index + 1"
          :complete="isStepComplete(index)"
          :editable="isStepAccessible(index)"
          class="stepper-item"
          @click="navigateToStep(index)"
        >
          <template #title>
            <span class="step-title">{{ step.title }}</span>
          </template>
          
          <template #subtitle>
            <span class="step-subtitle">{{ step.subtitle }}</span>
          </template>
          
          <template #icon>
            <v-avatar 
              :color="getStepColor(index)" 
              size="32"
              class="step-avatar"
            >
              <v-icon 
                :icon="getStepIcon(index)" 
                size="18"
                :color="getStepIconColor(index)"
              />
            </v-avatar>
          </template>
        </v-stepper-item>
      </template>
    </v-stepper>

    <!-- Mobile Progress Indicator -->
    <v-card v-else class="mobile-progress" flat>
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center">
            <v-avatar 
              :color="getCurrentStepColor()" 
              size="40"
              class="mr-3"
            >
              <v-icon 
                :icon="getCurrentStepIcon()" 
                size="20"
                color="white"
              />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ getCurrentStep()?.title }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Step {{ currentStepNumber }} of {{ steps.length }}
              </div>
            </div>
          </div>
          
          <v-chip 
            :color="getProgressColor()"
            size="small"
            variant="flat"
          >
            {{ Math.round((currentStepNumber / steps.length) * 100) }}%
          </v-chip>
        </div>

        <div class="progress-container">
          <v-progress-linear
            :model-value="(currentStepNumber / steps.length) * 100"
            :color="getProgressColor()"
            height="8"
            rounded
            class="mb-2"
          />
          <div class="d-flex justify-space-between">
            <span class="text-caption text-medium-emphasis">
              {{ getCurrentStep()?.subtitle }}
            </span>
            <span class="text-caption text-medium-emphasis">
              {{ completedSteps.length }} completed
            </span>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Optional: Step Navigation Pills for Mobile -->
    <v-card v-if="isMobile && showMobileNavigation" flat class="mobile-navigation mt-2">
      <v-card-text class="pa-2">
        <div class="d-flex flex-wrap gap-1">
          <v-chip
            v-for="(step, index) in steps"
            :key="step.route"
            :color="getStepColor(index)"
            :variant="isCurrentStep(index) ? 'flat' : 'outlined'"
            size="small"
            :disabled="!isStepAccessible(index)"
            @click="navigateToStep(index)"
            class="ma-1"
          >
            <v-icon :icon="getStepIcon(index)" size="12" class="mr-1" />
            {{ index + 1 }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    default: () => []
  },
  completedSteps: {
    type: Array,
    default: () => []
  },
  showMobileNavigation: {
    type: Boolean,
    default: false
  },
  allowStepNavigation: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['step-change', 'step-complete']);

const router = useRouter();
const route = useRoute();
const { mobile } = useDisplay();

const isMobile = computed(() => mobile.value);

// Find current step based on route
const currentStepNumber = computed(() => {
  const currentRoute = route.path;
  const stepIndex = props.steps.findIndex(step => step.route === currentRoute);
  return stepIndex >= 0 ? stepIndex + 1 : 1;
});

// Convert steps to stepper items format
const stepItems = computed(() => {
  return props.steps.map((step, index) => ({
    title: step.title,
    subtitle: step.subtitle,
    value: index + 1
  }));
});

// Get current step object
const getCurrentStep = () => {
  return props.steps[currentStepNumber.value - 1];
};

// Check if step is complete
const isStepComplete = (stepIndex) => {
  const step = props.steps[stepIndex];
  return props.completedSteps.includes(step.route);
};

// Check if step is accessible
const isStepAccessible = (stepIndex) => {
  if (!props.allowStepNavigation) return false;
  
  // Current step is always accessible
  if (stepIndex === currentStepNumber.value - 1) return true;
  
  // Previous steps are accessible if they're complete or if we're allowing free navigation
  if (stepIndex < currentStepNumber.value - 1) return true;
  
  // Next steps are accessible only if all previous steps are complete
  for (let i = 0; i < stepIndex; i++) {
    if (!isStepComplete(i)) return false;
  }
  
  return true;
};

// Check if this is the current step
const isCurrentStep = (stepIndex) => {
  return stepIndex === currentStepNumber.value - 1;
};

// Get step color based on status
const getStepColor = (stepIndex) => {
  if (isStepComplete(stepIndex)) return 'success';
  if (isCurrentStep(stepIndex)) return 'primary';
  if (isStepAccessible(stepIndex)) return 'grey-lighten-1';
  return 'grey-lighten-3';
};

// Get step icon based on status
const getStepIcon = (stepIndex) => {
  const step = props.steps[stepIndex];
  if (isStepComplete(stepIndex)) return 'mdi-check';
  if (isCurrentStep(stepIndex)) return step.icon || 'mdi-circle';
  return step.icon || 'mdi-circle-outline';
};

// Get step icon color
const getStepIconColor = (stepIndex) => {
  if (isStepComplete(stepIndex)) return 'white';
  if (isCurrentStep(stepIndex)) return 'white';
  return 'grey-darken-1';
};

// Get current step color
const getCurrentStepColor = () => {
  return getStepColor(currentStepNumber.value - 1);
};

// Get current step icon
const getCurrentStepIcon = () => {
  return getStepIcon(currentStepNumber.value - 1);
};

// Get progress color based on completion
const getProgressColor = () => {
  const completionRate = props.completedSteps.length / props.steps.length;
  if (completionRate >= 0.8) return 'success';
  if (completionRate >= 0.5) return 'warning';
  return 'primary';
};

// Navigate to specific step
const navigateToStep = (stepIndex) => {
  if (!isStepAccessible(stepIndex)) return;
  
  const step = props.steps[stepIndex];
  emit('step-change', { 
    stepIndex, 
    step, 
    route: step.route 
  });
  
  if (step.route !== route.path) {
    router.push(step.route);
  }
};

// Watch for route changes to emit step change events
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    const stepIndex = props.steps.findIndex(step => step.route === newPath);
    if (stepIndex >= 0) {
      emit('step-change', { 
        stepIndex, 
        step: props.steps[stepIndex], 
        route: newPath 
      });
    }
  }
});

onMounted(() => {
  // Emit initial step on mount
  const stepIndex = currentStepNumber.value - 1;
  if (stepIndex >= 0) {
    emit('step-change', { 
      stepIndex, 
      step: props.steps[stepIndex], 
      route: route.path 
    });
  }
});
</script>

<style scoped>
.onboarding-stepper {
  width: 100%;
  margin-bottom: 1rem;
}

.stepper-container {
  background: transparent !important;
  box-shadow: none !important;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  overflow: hidden;
}

.stepper-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stepper-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.step-title {
  font-weight: 600;
  font-size: 0.9rem;
}

.step-subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
}

.step-avatar {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-progress {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
}

.progress-container {
  position: relative;
}

.mobile-navigation {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
}

/* Vuetify stepper customization */
:deep(.v-stepper) {
  background: transparent !important;
}

:deep(.v-stepper-header) {
  box-shadow: none !important;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep(.v-stepper-item) {
  padding: 1rem !important;
}

:deep(.v-stepper-item__avatar) {
  margin-right: 1rem !important;
}

:deep(.v-stepper-item--complete .v-stepper-item__avatar) {
  background-color: rgb(var(--v-theme-success)) !important;
}

:deep(.v-stepper-item--active .v-stepper-item__avatar) {
  background-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-stepper-item__content) {
  padding-bottom: 0 !important;
}

/* Responsive design */
@media (max-width: 960px) {
  .step-title {
    font-size: 0.85rem;
  }
  
  .step-subtitle {
    font-size: 0.75rem;
  }
}

@media (max-width: 600px) {
  .onboarding-stepper {
    margin-bottom: 0.5rem;
  }
  
  .mobile-progress .v-card-text {
    padding: 1rem !important;
  }
}
</style> 