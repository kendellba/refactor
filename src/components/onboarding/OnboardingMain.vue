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

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppStepper from '@/components/ui/AppStepper.vue';
import BasicInfoForm from './BasicInfoForm.vue';
import ContactInfoForm from './ContactInfoForm.vue';
import AddressInfoForm from './AddressInfoForm.vue';
import EmploymentInfoForm from './EmploymentInfoForm.vue';
import BranchSelectionForm from './BranchSelectionForm.vue';

const router = useRouter();
const isMobile = ref(false);

// Define the steps for the onboarding process
const steps = [
  {
    title: 'Basic Information',
    subtitle: 'Personal details',
    icon: 'mdi-account'
  },
  {
    title: 'Contact Information',
    subtitle: 'How to reach you',
    icon: 'mdi-phone'
  },
  {
    title: 'Address Information',
    subtitle: 'Where you live',
    icon: 'mdi-map-marker'
  },
  {
    title: 'Employment Information',
    subtitle: 'Work details',
    icon: 'mdi-briefcase'
  },
  {
    title: 'Branch Selection',
    subtitle: 'Choose your branch',
    icon: 'mdi-bank'
  }
];

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

// Check if mobile on mount
onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });
});
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