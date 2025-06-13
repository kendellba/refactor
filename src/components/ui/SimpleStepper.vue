<template>
  <div class="simple-stepper">
    <!-- Desktop Stepper -->
    <v-stepper 
      v-if="!$vuetify.display.mobile"
      v-model="currentStep"
      class="elevation-2 rounded-lg"
      alt-labels
    >
      <v-stepper-header>
        <template v-for="(step, index) in steps" :key="index">
          <v-stepper-item
            :value="index + 1"
            :complete="isStepComplete(index)"
            :title="step.title"
            :subtitle="step.subtitle"
            @click="handleStepClick(index)"
          >
            <template #icon>
              <v-icon :color="getStepColor(index)">
                {{ getStepIcon(index) }}
              </v-icon>
            </template>
          </v-stepper-item>
          <v-divider v-if="index < steps.length - 1" :key="`divider-${index}`" />
        </template>
      </v-stepper-header>
    </v-stepper>

    <!-- Mobile Progress -->
    <v-card v-else class="mobile-stepper pa-4">
      <div class="d-flex align-center mb-3">
        <v-icon :color="getCurrentStepColor()" class="mr-3">
          {{ getCurrentStepIcon() }}
        </v-icon>
        <div class="flex-grow-1">
          <div class="text-subtitle-1 font-weight-medium">
            {{ steps[currentStep - 1]?.title }}
          </div>
          <div class="text-caption text-medium-emphasis">
            Step {{ currentStep }} of {{ steps.length }}
          </div>
        </div>
        <v-chip :color="getProgressColor()" size="small">
          {{ Math.round((currentStep / steps.length) * 100) }}%
        </v-chip>
      </div>
      
      <v-progress-linear
        :model-value="(currentStep / steps.length) * 100"
        :color="getProgressColor()"
        height="6"
        rounded
      />
    </v-card>

    <!-- Step Navigation (Optional) -->
    <div v-if="showNavigation" class="d-flex justify-space-between mt-4">
      <v-btn
        :disabled="currentStep <= 1"
        variant="outlined"
        @click="previousStep"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Previous
      </v-btn>
      
      <v-btn
        :disabled="currentStep >= steps.length"
        color="primary"
        @click="nextStep"
      >
        Next
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { StepItem, StepClickEvent, StepChangeEvent } from '../../types';

interface StepItemComputed {
  title: string;
  subtitle?: string;
  value: number;
}

interface Props {
  steps: StepItem[];
  completedSteps?: (string | number)[];
  initialStep?: number;
  showNavigation?: boolean;
  allowStepNavigation?: boolean;
}

interface Emits {
  (e: 'step-change', event: StepChangeEvent): void;
  (e: 'step-complete', event: { stepIndex: number; step: StepItem }): void;
  (e: 'step-click', event: StepClickEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  completedSteps: () => [],
  initialStep: 1,
  showNavigation: false,
  allowStepNavigation: true
});

const emit = defineEmits<Emits>();

const router = useRouter();
const route = useRoute();

const currentStep: Ref<number> = ref(props.initialStep);

// Computed properties
const stepItems: ComputedRef<StepItemComputed[]> = computed(() => {
  return props.steps.map((step, index) => ({
    title: step.title,
    subtitle: step.subtitle,
    value: index + 1
  }));
});

const isStepComplete = (stepIndex: number): boolean => {
  const step = props.steps[stepIndex];
  return props.completedSteps.includes(step.route || step.id || stepIndex);
};

const getStepColor = (stepIndex: number): 'success' | 'primary' | 'grey' => {
  if (isStepComplete(stepIndex)) return 'success';
  if (stepIndex + 1 === currentStep.value) return 'primary';
  return 'grey';
};

const getStepIcon = (stepIndex: number): string => {
  const step = props.steps[stepIndex];
  if (isStepComplete(stepIndex)) return 'mdi-check';
  return step.icon || 'mdi-circle';
};

const getCurrentStepColor = (): 'success' | 'primary' | 'grey' => {
  return getStepColor(currentStep.value - 1);
};

const getCurrentStepIcon = (): string => {
  return getStepIcon(currentStep.value - 1);
};

const getProgressColor = (): 'success' | 'warning' | 'primary' => {
  const progress = (currentStep.value / props.steps.length) * 100;
  if (progress >= 80) return 'success';
  if (progress >= 50) return 'warning';
  return 'primary';
};

// Methods
const handleStepClick = (stepIndex: number): void => {
  if (!props.allowStepNavigation) return;
  
  const newStep = stepIndex + 1;
  currentStep.value = newStep;
  
  const step = props.steps[stepIndex];
  emit('step-click', { stepIndex, step });
  
  // Navigate if route is provided
  if (step.route && step.route !== route.path) {
    router.push(step.route);
  }
};

const nextStep = (): void => {
  if (currentStep.value < props.steps.length) {
    currentStep.value++;
    emitStepChange();
  }
};

const previousStep = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--;
    emitStepChange();
  }
};

const emitStepChange = (): void => {
  const stepIndex = currentStep.value - 1;
  const step = props.steps[stepIndex];
  emit('step-change', { stepIndex, step, currentStep: currentStep.value });
};

// Watch for route changes to update current step
watch(() => route.path, (newPath: string) => {
  const stepIndex = props.steps.findIndex(step => step.route === newPath);
  if (stepIndex >= 0) {
    currentStep.value = stepIndex + 1;
  }
});

// Watch current step changes
watch(currentStep, () => {
  emitStepChange();
});
</script>

<style scoped>
.simple-stepper {
  width: 100%;
}

.mobile-stepper {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
}

:deep(.v-stepper-item) {
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.v-stepper-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

:deep(.v-stepper-header) {
  box-shadow: none;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style> 