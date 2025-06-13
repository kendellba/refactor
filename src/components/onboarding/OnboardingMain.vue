<template>
  <div class="onboarding-container">
    <AppStepper
      :steps="steps"
      :is-mobile="isMobile"
      @update:step="handleStepUpdate"
      @complete="handleComplete"
    >
      <!-- Basic Info Step -->
      <template #step-1="{ step }">
        <BasicInfoForm
          v-model="onboardingData.basicInfo"
          @valid="handleBasicInfoValid"
        />
      </template>

      <!-- Contact Info Step -->
      <template #step-2="{ step }">
        <ContactInfoForm
          v-model="onboardingData.contactInfo"
          @valid="handleContactInfoValid"
        />
      </template>

      <!-- Address Info Step -->
      <template #step-3="{ step }">
        <AddressInfoForm
          v-model="onboardingData.addressInfo"
          @valid="handleAddressInfoValid"
        />
      </template>

      <!-- Employment Info Step -->
      <template #step-4="{ step }">
        <EmploymentInfoForm
          v-model="onboardingData.employmentInfo"
          @valid="handleEmploymentInfoValid"
        />
      </template>

      <!-- Branch Selection Step -->
      <template #step-5="{ step }">
        <BranchSelectionForm
          v-model="onboardingData.branchInfo"
          @valid="handleBranchInfoValid"
        />
      </template>
    </AppStepper>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, type ComputedRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppStepper from '@/components/ui/AppStepper.vue';
import BasicInfoForm from './BasicInfoForm.vue';
import ContactInfoForm from './ContactInfoForm.vue';
import AddressInfoForm from './AddressInfoForm.vue';
import EmploymentInfoForm from './EmploymentInfoForm.vue';
import BranchSelectionForm from './BranchSelectionForm.vue';

const router = useRouter();
const route = useRoute();
const isMobile = ref(false);

const pageTitle: ComputedRef<string> = computed(() => {
  const routeTitle = route.meta?.title;
  return routeTitle ? String(routeTitle) : 'Onboarding';
});

// Define the steps for the onboarding process
const steps = ref([
  {
    id: '1',
    title: 'Basic Information',
    subtitle: 'Personal details',
    component: 'BasicInfoForm',
    isCompleted: false,
    isActive: true
  },
  {
    id: '2',
    title: 'Address Information',
    subtitle: 'Contact details',
    component: 'AddressForm',
    isCompleted: false,
    isActive: false
  },
  {
    id: '3',
    title: 'ID Information',
    subtitle: 'Identity verification',
    component: 'IDInformationForm',
    isCompleted: false,
    isActive: false
  },
  {
    id: '4',
    title: 'Employment Information',
    subtitle: 'Work details',
    component: 'EmploymentInformationForm',
    isCompleted: false,
    isActive: false
  }
]);

// Reactive state for the current step
const currentStep = reactive({
  id: '1',
  component: 'BasicInfoForm'
});

// Method to handle step navigation
const goToStep = (stepId: string): void => {
  const step = steps.value.find(s => s.id === stepId);
  if (step) {
    // Update active state
    steps.value.forEach(s => {
      s.isActive = s.id === stepId;
    });
    
    // Update current step
    currentStep.id = stepId as any;
    currentStep.component = step.component;
  }
};

// Method to mark step as completed and move to next
const completeStep = (stepId: string): void => {
  const step = steps.value.find(s => s.id === stepId);
  if (step) {
    step.isCompleted = true;
    
    // Move to next step if available
    const nextStep = steps.value.find(s => s.id === stepId + 1);
    if (nextStep) {
      goToStep(nextStep.id);
    }
  }
};

// Handle window resize for mobile detection
const handleResize = (): void => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Store all onboarding data
const onboardingData = reactive({
  basicInfo: {},
  contactInfo: {},
  addressInfo: {},
  employmentInfo: {},
  branchInfo: {}
});

// Track validation state for each step
const stepValidation = reactive({
  basicInfo: false,
  contactInfo: false,
  addressInfo: false,
  employmentInfo: false,
  branchInfo: false
});

// Handle step updates
const handleStepUpdate = (step) => {
  console.log('Current step:', step);
};

// Handle completion of the onboarding process
const handleComplete = async () => {
  try {
    // Here you would typically send the data to your backend
    console.log('Onboarding data:', onboardingData);
    
    // Navigate to success page or dashboard
    router.push('/onboarding/success');
  } catch (error) {
    console.error('Error completing onboarding:', error);
    // Handle error appropriately
  }
};

// Validation handlers for each step
const handleBasicInfoValid = (isValid) => {
  stepValidation.basicInfo = isValid;
};

const handleContactInfoValid = (isValid) => {
  stepValidation.contactInfo = isValid;
};

const handleAddressInfoValid = (isValid) => {
  stepValidation.addressInfo = isValid;
};

const handleEmploymentInfoValid = (isValid) => {
  stepValidation.employmentInfo = isValid;
};

const handleBranchInfoValid = (isValid) => {
  stepValidation.branchInfo = isValid;
};
</script>

<style scoped>
.onboarding-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .onboarding-container {
    padding: 1rem;
  }
}
</style> 


