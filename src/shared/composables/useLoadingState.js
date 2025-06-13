import { ref, computed } from 'vue';

export function useLoadingState(options = {}) {
  const {
    debounceMs = 300,
    showProgress = false,
    progressSteps = 1,
  } = options;

  const isLoading = ref(false);
  const progress = ref(0);
  const loadingMessage = ref('');
  const loadingStep = ref(0);

  // Computed property to determine if we should show loading state
  // This helps prevent flickering for very quick operations
  const shouldShowLoading = computed(() => {
    return isLoading.value && progress.value > 0;
  });

  // Start loading with optional message
  const startLoading = (message = 'Processing...') => {
    loadingMessage.value = message;
    isLoading.value = true;
    progress.value = 0;
    loadingStep.value = 0;
  };

  // Update progress
  const updateProgress = (step, message) => {
    if (step > progressSteps) {
      console.warn(`Step ${step} exceeds total steps ${progressSteps}`);
      return;
    }
    loadingStep.value = step;
    progress.value = (step / progressSteps) * 100;
    if (message) {
      loadingMessage.value = message;
    }
  };

  // Complete loading
  const completeLoading = () => {
    progress.value = 100;
    setTimeout(() => {
      isLoading.value = false;
      progress.value = 0;
      loadingStep.value = 0;
      loadingMessage.value = '';
    }, 300); // Small delay to show completion
  };

  // Error loading
  const errorLoading = (errorMessage) => {
    loadingMessage.value = errorMessage || 'An error occurred';
    setTimeout(() => {
      isLoading.value = false;
      progress.value = 0;
      loadingStep.value = 0;
      loadingMessage.value = '';
    }, 300);
  };

  return {
    isLoading,
    progress,
    loadingMessage,
    loadingStep,
    shouldShowLoading,
    startLoading,
    updateProgress,
    completeLoading,
    errorLoading,
  };
} 