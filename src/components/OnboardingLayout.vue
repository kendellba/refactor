<template>
  <div class="onboarding-layout">
    <!-- Stepper Header -->
    <div class="stepper-header" v-if="showStepper">
      <v-container>
        <OnboardingStepper
          :steps="visibleSteps"
          :completed-steps="completedSteps"
          :show-mobile-navigation="showMobileNavigation"
          :allow-step-navigation="allowStepNavigation"
          @step-change="handleStepChange"
          @step-complete="handleStepComplete"
        />
      </v-container>
    </div>

    <!-- Main Content -->
    <div class="onboarding-content">
      <router-view 
        @step-complete="markCurrentStepComplete"
        @step-skip="markCurrentStepSkipped"
        @save-data="handleSaveData"
      />
    </div>

    <!-- Optional: Floating Progress Indicator -->
    <v-fab
      v-if="showFloatingProgress && isMobile"
      :icon="progressIcon"
      :color="progressColor"
      location="bottom end"
      size="small"
      class="floating-progress"
      @click="toggleProgressDetails"
    >
      <template #default>
        <span class="text-caption font-weight-bold">
          {{ Math.round(progress) }}%
        </span>
      </template>
    </v-fab>

    <!-- Progress Details Dialog -->
    <v-dialog v-model="showProgressDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-progress-check" class="mr-2" />
          Onboarding Progress
        </v-card-title>
        
        <v-card-text>
          <div class="mb-4">
            <v-progress-linear
              :model-value="progress"
              :color="progressColor"
              height="8"
              rounded
            />
            <div class="d-flex justify-space-between mt-2">
              <span class="text-caption">{{ completedSteps.length }} completed</span>
              <span class="text-caption">{{ progress }}% done</span>
            </div>
          </div>

          <v-list density="compact">
            <v-list-item
              v-for="(step, index) in visibleSteps"
              :key="step.route"
              :class="getStepListItemClass(step)"
              @click="navigateToStepIfAllowed(step)"
            >
              <template #prepend>
                <v-icon
                  :icon="getStepStatusIcon(step)"
                  :color="getStepStatusColor(step)"
                  size="small"
                />
              </template>

              <v-list-item-title class="text-body-2">
                {{ step.title }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-caption">
                {{ step.subtitle }}
              </v-list-item-subtitle>

              <template #append>
                <v-chip
                  v-if="isCurrentStepRoute(step.route)"
                  size="x-small"
                  color="primary"
                  variant="flat"
                >
                  Current
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showProgressDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import OnboardingStepper from '@/components/ui/OnboardingStepper.vue';
import { useOnboardingStepper } from '@/composables/useOnboardingStepper.js';
import { useDemoStore } from '@/store/demoStore';
import type { OnboardingStepperProps, StepItem, StepCompleteEvent, StepSaveData, VuetifyColor } from '@/types';

interface UserProfile {
  isMinor?: boolean;
  hasForeignBankAccount?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<OnboardingStepperProps>(), {
  showStepper: true,
  showMobileNavigation: false,
  allowStepNavigation: true,
  showFloatingProgress: true
});

const route = useRoute();
const { mobile } = useDisplay();
const demoStore = useDemoStore();

const {
  completedSteps,
  skippedSteps,
  currentStep,
  progress,
  getVisibleSteps,
  markStepComplete,
  markStepSkipped,
  isStepComplete,
  isStepSkipped,
  navigateToStep,
  saveStepData,
  loadFromStorage,
  saveToStorage,
  ONBOARDING_STEPS
} = useOnboardingStepper() as {
  completedSteps: Ref<string[]>;
  skippedSteps: Ref<string[]>;
  currentStep: Ref<StepItem | null>;
  progress: Ref<number>;
  getVisibleSteps: (profile: UserProfile) => StepItem[];
  markStepComplete: (route: string) => void;
  markStepSkipped: (route: string) => void;
  isStepComplete: (route: string) => boolean;
  isStepSkipped: (route: string) => boolean;
  navigateToStep: (route: string) => void;
  saveStepData: (route: string, data: any) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  ONBOARDING_STEPS: StepItem[];
};

// Local state
const showProgressDialog = ref<boolean>(false);
const userProfile = ref<UserProfile>({});

// Computed properties
const isMobile = computed((): boolean => mobile.value);

const visibleSteps = computed((): StepItem[] => {
  return getVisibleSteps(userProfile.value);
});

const progressColor = computed((): VuetifyColor => {
  if (progress.value >= 80) return 'success';
  if (progress.value >= 50) return 'warning';
  return 'primary';
});

const progressIcon = computed((): string => {
  if (progress.value >= 100) return 'mdi-check-circle';
  if (progress.value >= 80) return 'mdi-progress-check';
  return 'mdi-progress-clock';
});

// Methods
const handleStepChange = ({ stepIndex, step, route: stepRoute }: { stepIndex: number; step: StepItem; route: string }): void => {
  console.log('Step changed:', { stepIndex, step, stepRoute });
  
  // Auto-save progress
  saveToStorage();
};

const handleStepComplete = ({ step }: StepCompleteEvent): void => {
  markStepComplete(step.route);
  saveToStorage();
};

const markCurrentStepComplete = (data: StepSaveData = {}): void => {
  if (currentStep.value) {
    markStepComplete(currentStep.value.route);
    if (Object.keys(data).length > 0) {
      saveStepData(currentStep.value.route, data);
    }
    saveToStorage();
  }
};

const markCurrentStepSkipped = (reason = ''): void => {
  if (currentStep.value) {
    markStepSkipped(currentStep.value.route);
    if (reason) {
      saveStepData(currentStep.value.route, { skipped: true, reason });
    }
    saveToStorage();
  }
};

const handleSaveData = (data: StepSaveData): void => {
  if (currentStep.value) {
    saveStepData(currentStep.value.route, data);
    saveToStorage();
  }
};

const toggleProgressDetails = (): void => {
  showProgressDialog.value = !showProgressDialog.value;
};

const getStepStatusIcon = (step: StepItem): string => {
  if (isStepComplete(step.route)) return 'mdi-check-circle';
  if (isStepSkipped(step.route)) return 'mdi-skip-next';
  if (isCurrentStepRoute(step.route)) return 'mdi-play-circle';
  return 'mdi-circle-outline';
};

const getStepStatusColor = (step: StepItem): VuetifyColor => {
  if (isStepComplete(step.route)) return 'success';
  if (isStepSkipped(step.route)) return 'warning';
  if (isCurrentStepRoute(step.route)) return 'primary';
  return 'grey';
};

const getStepListItemClass = (step: StepItem): string => {
  const classes: string[] = [];
  
  if (isCurrentStepRoute(step.route)) {
    classes.push('current-step');
  }
  
  if (isStepComplete(step.route)) {
    classes.push('completed-step');
  }
  
  if (isStepSkipped(step.route)) {
    classes.push('skipped-step');
  }
  
  return classes.join(' ');
};

const isCurrentStepRoute = (stepRoute: string): boolean => {
  return route.path === stepRoute;
};

const navigateToStepIfAllowed = (step: StepItem): void => {
  if (props.allowStepNavigation) {
    navigateToStep(step.route);
    showProgressDialog.value = false;
  }
};

// Update user profile based on demo store
const updateUserProfile = (): void => {
  const profile: UserProfile = {
    isMinor: (demoStore as any).userAge < 18,
    hasForeignBankAccount: (demoStore as any).hasForeignBankAccount || false,
    // Add other profile properties as needed
  };
  
  userProfile.value = profile;
};

// Watch for demo store changes
watch(() => [(demoStore as any).userAge, (demoStore as any).hasForeignBankAccount], () => {
  updateUserProfile();
}, { deep: true });

// Lifecycle
onMounted(() => {
  // Load saved progress
  loadFromStorage();
  
  // Update user profile
  updateUserProfile();
  
  // Mark current step as visited if not already complete
  if (currentStep.value && !isStepComplete(currentStep.value.route)) {
    // Optionally mark as visited or current
  }
});

// Auto-save on route changes
watch(() => route.path, () => {
  saveToStorage();
});
</script>

<style scoped>
.onboarding-layout {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.stepper-header {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.onboarding-content {
  flex: 1;
  min-height: calc(100vh - 120px);
}

.floating-progress {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.floating-progress .text-caption {
  line-height: 1;
}

/* Step list item styles */
:deep(.current-step) {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

:deep(.completed-step) {
  opacity: 0.8;
}

:deep(.skipped-step) {
  opacity: 0.6;
  text-decoration: line-through;
}

/* Mobile optimizations */
@media (max-width: 960px) {
  .stepper-header {
    padding: 0.5rem 0;
  }
  
  .onboarding-content {
    min-height: calc(100vh - 80px);
  }
}

@media (max-width: 600px) {
  .stepper-header {
    position: relative;
    top: auto;
  }
  
  .onboarding-content {
    min-height: auto;
  }
}

/* Animation for step transitions */
.onboarding-content {
  transition: all 0.3s ease-in-out;
}

/* Progress dialog customizations */
:deep(.v-dialog .v-card) {
  border-radius: 16px;
}

:deep(.v-list-item) {
  border-radius: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style> 