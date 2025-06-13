<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-4 rounded-lg">
          <v-card-title class="bg-primary text-white pa-4">
            <v-icon start>mdi-content-save-cog</v-icon>
            Enhanced Progress Persistence Demo
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Save Status -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <SaveIndicator
                  :is-dirty="formState.isDirty"
                  :is-saving="formState.isSaving"
                  :last-saved="lastSaved"
                  :save-error="saveError"
                  :floating="false"
                />
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <v-chip-group>
                  <v-chip v-if="hasRecoverableData" color="info" size="small">
                    <v-icon start size="16">mdi-history</v-icon>
                    {{ draftCount }} draft{{ draftCount !== 1 ? 's' : '' }}
                  </v-chip>
                  <v-chip v-if="isDirty" color="warning" size="small">
                    <v-icon start size="16">mdi-content-save-alert</v-icon>
                    Unsaved changes
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>

            <!-- Form Fields -->
            <v-form @submit.prevent="handleSubmit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formData.firstName"
                    @update:model-value="updateField('firstName', $event)"
                    label="First Name"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account"
                    @input="triggerAutoSave"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formData.lastName"
                    @update:model-value="updateField('lastName', $event)"
                    label="Last Name"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account"
                    @input="triggerAutoSave"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formData.email"
                    @update:model-value="updateField('email', $event)"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-email"
                    @input="triggerAutoSave"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formData.phone"
                    @update:model-value="updateField('phone', $event)"
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-phone"
                    @input="triggerAutoSave"
                  />
                </v-col>
              </v-row>

              <!-- Sensitive Data Example -->
              <v-row>
                <v-col cols="12">
                  <v-alert type="info" variant="tonal" class="mb-4">
                    <v-icon start>mdi-shield-lock</v-icon>
                    The SSN field below demonstrates encrypted auto-save for sensitive data
                  </v-alert>
                  <v-text-field
                    :model-value="formData.ssn"
                    @update:model-value="updateField('ssn', $event)"
                    label="SSN (Demo - Encrypted Auto-save)"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-shield-account"
                    placeholder="XXX-XX-XXXX"
                    @input="triggerAutoSave"
                  />
                </v-col>
              </v-row>

              <!-- Action Buttons -->
              <v-row class="mt-4">
                <v-col cols="12" class="d-flex gap-3">
                  <v-btn
                    color="primary"
                    variant="flat"
                    type="submit"
                    :loading="formState.isSubmitting"
                  >
                    Submit Form
                  </v-btn>

                  <v-btn
                    color="secondary"
                    variant="outlined"
                    @click="forceSave"
                    :loading="formState.isSaving"
                  >
                    Force Save
                  </v-btn>

                  <v-btn
                    color="warning"
                    variant="outlined"
                    @click="showDraftHistory = true"
                    :disabled="!hasRecoverableData"
                  >
                    View Drafts
                  </v-btn>

                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="resetForm"
                  >
                    Reset Form
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <!-- Performance Stats -->
            <v-divider class="my-6" />
            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-3">Auto-Save Statistics</h3>
                <v-row>
                  <v-col cols="6" md="3">
                    <v-card variant="outlined" class="text-center pa-3">
                      <div class="text-h6 text-primary">{{ draftCount }}</div>
                      <div class="text-caption">Drafts Saved</div>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card variant="outlined" class="text-center pa-3">
                      <div class="text-h6 text-success">{{ lastSaved ? '✓' : '✗' }}</div>
                      <div class="text-caption">Last Save</div>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card variant="outlined" class="text-center pa-3">
                      <div class="text-h6 text-info">2s</div>
                      <div class="text-caption">Auto-Save Interval</div>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card variant="outlined" class="text-center pa-3">
                      <div class="text-h6 text-warning">{{ formState.isDirty ? '●' : '○' }}</div>
                      <div class="text-caption">Dirty State</div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Recovery Dialog -->
    <DataRecoveryDialog
      :show="showRecoveryDialog"
      :last-saved="lastSaved"
      @restore="restoreFromSaved"
      @clear="discardSavedData"
      @close="showRecoveryDialog = false"
    />

    <!-- Draft History Dialog -->
    <v-dialog v-model="showDraftHistory" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon start>mdi-history</v-icon>
          Draft History
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(draft, index) in draftHistory"
              :key="draft.id"
              class="mb-2"
            >
              <template #prepend>
                <v-avatar color="primary" size="small">
                  {{ index + 1 }}
                </v-avatar>
              </template>
              
              <v-list-item-title>
                Draft {{ index + 1 }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                {{ formatDate(draft.metadata?.timestamp) }}
              </v-list-item-subtitle>

              <template #append>
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="restoreFromDraft(draft.id)"
                >
                  Restore
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDraftHistory = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, type Ref, type ComputedRef } from 'vue';
import { useEnhancedFormManager } from '@/composables/useEnhancedFormManager.js';
import SaveIndicator from '@/components/SaveIndicator.vue';
import DataRecoveryDialog from '@/components/DataRecoveryDialog.vue';
import type { DemoFormData } from '@/types';

interface FormState {
  isDirty: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
}

interface DraftItem {
  id: string;
  metadata?: {
    timestamp: number;
  };
}

const showDraftHistory: Ref<boolean> = ref(false);

// Initialize enhanced form manager with demo configuration
const formManagerResult = useEnhancedFormManager({
  initialData: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: ''
  },
  sensitiveFields: ['ssn'],
  autoSaveInterval: 2000,
  enableEncryption: true,
  storageKey: 'persistence-demo'
});

// Extract with proper typing
const {
  formData,
  fieldErrors,
  serverError,
  formState,
  saveStatus,
  showRecoveryDialog,
  recoveredData,
  hasRecoverableData,
  lastSaved,
  draftCount,
  updateField,
  updateFormData,
  validateField,
  validateForm,
  resetForm,
  submitForm,
  restoreFromSaved,
  discardSavedData,
  getDraftHistory,
  forceSave,
  clearSavedData
} = formManagerResult;

// Computed properties
const isDirty: ComputedRef<boolean> = computed(() => formState.value.isDirty);
const draftHistory: ComputedRef<DraftItem[]> = computed(() => getDraftHistory() as DraftItem[]);
const saveError: ComputedRef<null> = computed(() => null); // Placeholder for demo

// Methods
const handleSubmit = async (): Promise<void> => {
  try {
    await submitForm(async (data: any) => {
      // Simulate API call
      console.log('Submitting data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    });
    
    // Show success message
    alert('Form submitted successfully!');
  } catch (error: any) {
    console.error('Submission failed:', error);
    alert('Submission failed: ' + error.message);
  }
};

const restoreFromDraft = (draftId: string): void => {
  // This would be implemented by the enhanced form manager
  console.log('Restoring from draft:', draftId);
  showDraftHistory.value = false;
};

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleString();
};

let autoSaveTimeout: NodeJS.Timeout | null = null;

const triggerAutoSave = (): void => {
  formState.value.isDirty = true;
  
  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  // Set new timeout for auto-save
  autoSaveTimeout = setTimeout(() => {
    performAutoSave();
  }, 2000);
};

const performAutoSave = (): void => {
  formState.value.isSaving = true;
  
  // Simulate save operation
  setTimeout(() => {
    localStorage.setItem('persistence-demo', JSON.stringify({
      data: formData.value,
      timestamp: Date.now()
    }));
    
    formState.value.isDirty = false;
    formState.value.isSaving = false;
    lastSaved.value = new Date();
  }, 500);
};

const resetFormData = (): void => {
  Object.keys(formData.value).forEach(key => {
    (formData.value as any)[key] = '';
  });
  localStorage.removeItem('persistence-demo');
  formState.value.isDirty = false;
  lastSaved.value = null;
};

// Load saved data on mount
const loadSavedData = (): void => {
  try {
    const saved = localStorage.getItem('persistence-demo');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(formData.value, parsed.data);
      lastSaved.value = new Date(parsed.timestamp);
    }
  } catch (error) {
    console.error('Error loading saved data:', error);
  }
};

// Load data when component mounts
loadSavedData();
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.gap-3 {
  gap: 12px;
}
</style> 