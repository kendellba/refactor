<template>
  <div class="app-stepper">
    <!-- Desktop Stepper -->
    <v-stepper
      v-if="!isMobile"
      v-model="currentStep"
      :items="steps"
      :alt-labels="true"
      class="rounded-lg"
    >
      <template v-for="(step, index) in steps" :key="index">
        <template :v-slot="`item.${index + 1}`">
          <v-stepper-item
            :value="index + 1"
            :complete="currentStep > index + 1"
            :title="step.title"
            :subtitle="step.subtitle"
          >
            <template #icon>
              <v-icon :color="currentStep > index + 1 ? 'success' : undefined">
                {{ step.icon }}
              </v-icon>
            </template>
          </v-stepper-item>
        </template>

        <template :v-slot="`content.${index + 1}`">
          <v-card class="pa-4">
            <slot :name="`step-${index + 1}`" :step="step" :index="index"></slot>
          </v-card>
        </template>
      </template>
    </v-stepper>

    <!-- Mobile Stepper -->
    <div v-else class="mobile-stepper">
      <v-card class="mb-4">
        <v-card-text>
          <div class="d-flex align-center mb-4">
            <v-icon
              :color="currentStep > 1 ? 'success' : 'primary'"
              class="mr-2"
              size="small"
            >
              {{ steps[currentStep - 1].icon }}
            </v-icon>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Step {{ currentStep }} of {{ steps.length }}
              </div>
              <div class="text-caption text-grey">
                {{ steps[currentStep - 1].title }}
              </div>
            </div>
          </div>

          <v-progress-linear
            :model-value="(currentStep / steps.length) * 100"
            color="primary"
            height="4"
            rounded
          ></v-progress-linear>
        </v-card-text>
      </v-card>

      <v-card class="pa-4">
        <slot :name="`step-${currentStep}`" :step="steps[currentStep - 1]" :index="currentStep - 1">
        </slot>
      </v-card>
    </div>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-space-between mt-4">
      <v-btn
        v-if="currentStep > 1"
        variant="outlined"
        color="primary"
        @click="previousStep"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Previous
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="currentStep < steps.length"
        color="primary"
        @click="nextStep"
      >
        Next
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
      <v-btn
        v-else
        color="success"
        @click="complete"
      >
        Complete
        <v-icon end>mdi-check</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { StepItem } from '../../types';

interface Props {
  steps: StepItem[];
  isMobile?: boolean;
  initialStep?: number;
}

interface Emits {
  (e: 'update:step', step: number): void;
  (e: 'complete'): void;
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
  initialStep: 1
});

const emit = defineEmits<Emits>();

const currentStep: Ref<number> = ref(props.initialStep);

const nextStep = (): void => {
  if (currentStep.value < props.steps.length) {
    currentStep.value++;
    emit('update:step', currentStep.value);
  }
};

const previousStep = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--;
    emit('update:step', currentStep.value);
  }
};

const complete = (): void => {
  emit('complete');
};
</script>

<style scoped>
.app-stepper {
  width: 100%;
}

.mobile-stepper {
  width: 100%;
}

/* Add smooth transitions */
.v-stepper-item {
  transition: all 0.3s ease;
}

/* Custom styling for the progress bar */
.v-progress-linear {
  transition: all 0.3s ease;
}
</style> 