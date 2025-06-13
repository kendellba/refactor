<template>
  <div>
    <!-- Mobile Form View -->
    <v-bottom-sheet v-if="isMobile && currentView === 'form'" v-model="isOpen" scrollable>
      <v-card height="90vh">
        <v-toolbar color="primary" theme="dark">
          <template #prepend>
            <v-btn icon @click="closeForm">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <v-toolbar-title>Transfer to Self</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <div class="pa-2">
            <!-- Source Account -->
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="font-weight-medium mb-2">Source Account</div>
                <v-select
                  v-model="transferDetails.sourceAccount"
                  label="Select Source Account"
                  :items="transferStore.getAccountOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  class="mb-2"
                  hide-details
                  @update:model-value="updateSourceAccount"
                ></v-select>

                <div class="d-flex justify-space-between align-center mt-3 mb-1">
                  <div class="text-caption">Available Balance:</div>
                  <div class="text-subtitle-2 font-weight-bold">
                    {{
                      transferDetails.sourceAccount === 'ordinary'
                        ? 'TTD $252,250.12'
                        : transferDetails.sourceAccount === 'special'
                          ? 'TTD $10,300.00'
                          : '---'
                    }}
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Destination Account -->
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="font-weight-medium mb-2">Destination Account</div>
                <v-select
                  v-model="transferDetails.destinationAccount"
                  label="Select Destination Account"
                  :items="transferStore.getDestinationOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  class="mb-2"
                  hide-details
                ></v-select>

                <div class="d-flex justify-space-between align-center mt-3 mb-1">
                  <div class="text-caption">Available Balance:</div>
                  <div class="text-subtitle-2 font-weight-bold">
                    {{
                      transferDetails.destinationAccount === 'ordinary'
                        ? 'TTD $252,250.12'
                        : transferDetails.destinationAccount === 'special'
                          ? 'TTD $10,300.00'
                          : '---'
                    }}
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Transfer Amount -->
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="d-flex align-center mb-2">
                  <v-icon start>mdi-currency-usd</v-icon>
                  <v-text-field
                    v-model="transferDetails.amount"
                    label="Transfer Amount"
                    variant="outlined"
                    hide-details
                    density="comfortable"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  ></v-text-field>
                </div>
              </v-card-text>
            </v-card>

            <!-- Transfer Description -->
            <v-card variant="outlined" class="mb-6 rounded-lg">
              <v-card-text>
                <div class="d-flex align-center mb-2">
                  <v-icon start>mdi-text-box-outline</v-icon>
                  <v-text-field
                    v-model="transferDetails.description"
                    label="Transfer description"
                    variant="outlined"
                    hide-details
                    density="comfortable"
                    placeholder="Optional"
                  ></v-text-field>
                </div>
              </v-card-text>
            </v-card>

            <!-- Action Buttons -->
            <v-btn
              block
              color="primary"
              class="mb-3 rounded-lg"
              variant="flat"
              height="48"
              :loading="loading"
              @click="showConfirmation('now')"
            >
              Transfer Now
            </v-btn>

            <v-btn
              block
              color="primary"
              class="rounded-lg"
              variant="outlined"
              height="48"
              :disabled="loading"
              @click="showConfirmation('schedule')"
            >
              Schedule this Transfer
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <!-- Mobile Confirmation View -->
    <v-bottom-sheet v-if="isMobile && currentView === 'confirmation'" v-model="isOpen" scrollable>
      <v-card height="90vh">
        <!-- Confirmation Content -->
        <div class="pa-6 confirmation-container">
          <div class="text-center mb-6">
            <div class="text-h5 font-weight-bold mb-1 primary--text">
              Self Transfer Confirmation
            </div>
            <div class="text-body-2">Self Transfer confirmation</div>

            <div class="my-6 text-body-1 font-weight-medium">
              Are you sure you want to complete this transfer?
            </div>
          </div>

          <v-card variant="outlined" class="mb-4 rounded-lg">
            <v-card-text class="py-3">
              <div class="text-caption text-grey mb-1">Source Account</div>
              <div class="text-body-1">
                Ordinary Shares Account - {{ getAccountNumber('ordinary') }}
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined" class="mb-4 rounded-lg">
            <v-card-text class="py-3">
              <div class="text-caption text-grey mb-1">Destination Account</div>
              <div class="text-body-1">
                Special Shares Account - {{ getAccountNumber('special') }}
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined" class="mb-4 rounded-lg">
            <v-card-text class="py-3">
              <div class="text-caption text-grey mb-1">Transfer Amount</div>
              <div class="text-body-1">
                Amount: TTD ${{ parseFloat(transferDetails.amount).toFixed(2) }}
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined" class="mb-6 rounded-lg">
            <v-card-text class="py-3">
              <div class="text-caption text-grey mb-1">Description</div>
              <div class="text-body-1">
                {{ transferDetails.description || 'Transfer for savings' }}
              </div>
            </v-card-text>
          </v-card>

          <v-btn
            block
            color="primary"
            class="mb-3 rounded-lg"
            variant="flat"
            height="48"
            :loading="loading"
            @click="processTransfer(transferType)"
          >
            Yes
          </v-btn>

          <v-btn
            block
            color="warning"
            class="rounded-lg"
            variant="flat"
            height="48"
            :disabled="loading"
            @click="currentView = 'form'"
          >
            Back
          </v-btn>
        </div>
      </v-card>
    </v-bottom-sheet>

    <!-- Mobile Completed View -->
    <v-bottom-sheet v-if="isMobile && currentView === 'completed'" v-model="isOpen" scrollable>
      <v-card height="90vh">
        <!-- Completed Content -->
        <div class="pa-6 completed-container">
          <div class="text-center mb-6">
            <div class="text-h5 font-weight-bold mb-1 primary--text">Self Transfer Completed</div>
            <div class="text-body-2">Transaction Date: {{ currentDate }} {{ currentTime }}</div>
            <div class="text-body-2 primary--text">Transaction ID: {{ transactionId }}</div>

            <div class="d-flex justify-center my-8">
              <v-avatar color="teal" size="96" class="success-icon-container">
                <v-icon color="white" size="56">mdi-check</v-icon>
              </v-avatar>
            </div>
          </div>

          <div class="d-flex mb-6">
            <v-btn class="flex-grow-1 mr-2" color="primary" variant="flat" @click="printReceipt">
              Print Receipt
            </v-btn>
            <v-btn class="flex-grow-1 ml-2" color="primary" variant="flat" @click="downloadReceipt">
              Download Receipt
            </v-btn>
          </div>

          <v-card variant="outlined" class="mb-2 rounded-lg">
            <v-card-text class="py-2">
              <div class="text-caption text-grey mb-1">Source Account</div>
              <div class="text-body-2">
                Ordinary Shares Account - {{ getAccountNumber('ordinary') }}
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined" class="mb-2 rounded-lg">
            <v-card-text class="py-2">
              <div class="text-caption text-grey mb-1">Destination Account</div>
              <div class="text-body-2">
                Special Shares Account - {{ getAccountNumber('special') }}
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined" class="mb-2 rounded-lg">
            <v-card-text class="py-2">
              <div class="text-caption text-grey mb-1">Transfer Amount</div>
              <div class="text-body-2">
                Amount: TTD ${{ parseFloat(transferDetails.amount).toFixed(2) }}
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined" class="mb-6 rounded-lg">
            <v-card-text class="py-2">
              <div class="text-caption text-grey mb-1">Description</div>
              <div class="text-body-2">
                {{ transferDetails.description || 'Transfer for savings' }}
              </div>
            </v-card-text>
          </v-card>

          <v-btn
            block
            color="primary"
            class="rounded-lg"
            variant="flat"
            height="48"
            @click="goToDashboard"
          >
            Go to Dashboard
          </v-btn>
        </div>
      </v-card>
    </v-bottom-sheet>

    <!-- Desktop Form View -->
    <v-card v-else-if="!isMobile && currentView === 'form'" variant="outlined" class="mb-4">
      <v-card-title class="py-3 bg-grey-lighten-4">
        <v-icon start>mdi-account-reactivate</v-icon>
        Transfer to Self
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- Source Account Selection -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="rounded-lg mb-4 h-100">
              <v-card-text>
                <div class="font-weight-medium mb-3">Source Account</div>
                <v-select
                  v-model="transferDetails.sourceAccount"
                  label="Select Source Account"
                  :items="transferStore.getAccountOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-3"
                  @update:model-value="updateSourceAccount"
                ></v-select>

                <div class="d-flex justify-space-between align-center mt-4">
                  <div class="text-caption">Available Balance:</div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{
                      transferDetails.sourceAccount === 'ordinary'
                        ? 'TTD $252,250.12'
                        : transferDetails.sourceAccount === 'special'
                          ? 'TTD $10,300.00'
                          : '---'
                    }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Destination Account Selection -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="rounded-lg mb-4 h-100">
              <v-card-text>
                <div class="font-weight-medium mb-3">Destination Account</div>
                <v-select
                  v-model="transferDetails.destinationAccount"
                  label="Select Destination Account"
                  :items="transferStore.getDestinationOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-3"
                ></v-select>

                <div class="d-flex justify-space-between align-center mt-4">
                  <div class="text-caption">Available Balance:</div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{
                      transferDetails.destinationAccount === 'ordinary'
                        ? 'TTD $252,250.12'
                        : transferDetails.destinationAccount === 'special'
                          ? 'TTD $10,300.00'
                          : '---'
                    }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <!-- Transfer Amount -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="rounded-lg mb-4">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon class="mr-2">mdi-currency-usd</v-icon>
                  <v-text-field
                    v-model="transferDetails.amount"
                    label="Transfer Amount"
                    variant="outlined"
                    hide-details
                    density="comfortable"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  ></v-text-field>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Transfer Description -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="rounded-lg mb-4">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon class="mr-2">mdi-text-box-outline</v-icon>
                  <v-text-field
                    v-model="transferDetails.description"
                    label="Transfer description"
                    variant="outlined"
                    hide-details
                    density="comfortable"
                    placeholder="Optional"
                  ></v-text-field>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-btn
              block
              color="primary"
              variant="flat"
              height="48"
              class="rounded-lg"
              :loading="loading"
              @click="showConfirmation('now')"
            >
              Transfer Now
            </v-btn>
          </v-col>

          <v-col cols="12" md="6">
            <v-btn
              block
              color="primary"
              variant="outlined"
              height="48"
              class="rounded-lg"
              :disabled="loading"
              @click="showConfirmation('schedule')"
            >
              Schedule this Transfer
            </v-btn>
          </v-col>
        </v-row>

        <!-- Cancel Button -->
        <v-row class="mt-2">
          <v-col cols="12">
            <v-btn block variant="text" color="grey-darken-1" height="48" @click="closeForm">
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Desktop Confirmation View -->
    <v-card v-else-if="!isMobile && currentView === 'confirmation'" variant="outlined" class="mb-4">
      <v-card-title class="py-3 bg-grey-lighten-4">
        <v-icon start>mdi-account-reactivate</v-icon>
        Self Transfer Confirmation
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="text-center mb-6">
          <div class="text-h6 mb-2">Are you sure you want to complete this transfer?</div>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Source Account</div>
                <div class="text-body-1">
                  Ordinary Shares Account - {{ getAccountNumber('ordinary') }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Destination Account</div>
                <div class="text-body-1">
                  Special Shares Account - {{ getAccountNumber('special') }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Transfer Amount</div>
                <div class="text-body-1">
                  Amount: TTD ${{ parseFloat(transferDetails.amount).toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Description</div>
                <div class="text-body-1">
                  {{ transferDetails.description || 'Transfer for savings' }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-btn
              block
              color="primary"
              variant="flat"
              height="48"
              class="rounded-lg"
              :loading="loading"
              @click="processTransfer(transferType)"
            >
              Yes, Complete Transfer
            </v-btn>
          </v-col>

          <v-col cols="12" md="6">
            <v-btn
              block
              color="grey"
              variant="flat"
              height="48"
              class="rounded-lg"
              :disabled="loading"
              @click="currentView = 'form'"
            >
              Back
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Desktop Completed View -->
    <v-card v-else-if="!isMobile && currentView === 'completed'" variant="outlined" class="mb-4">
      <v-card-title class="py-3 bg-grey-lighten-4">
        <v-icon start>mdi-account-reactivate</v-icon>
        Self Transfer Completed
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="text-center mb-6">
          <div class="text-h6 mb-2">Transfer Completed Successfully</div>
          <div class="text-body-2">Transaction Date: {{ currentDate }} {{ currentTime }}</div>
          <div class="text-body-2 primary--text">Transaction ID: {{ transactionId }}</div>

          <div class="d-flex justify-center my-8">
            <v-avatar color="teal" size="96" class="success-icon-container">
              <v-icon color="white" size="56">mdi-check</v-icon>
            </v-avatar>
          </div>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Source Account</div>
                <div class="text-body-1">
                  Ordinary Shares Account - {{ getAccountNumber('ordinary') }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Destination Account</div>
                <div class="text-body-1">
                  Special Shares Account - {{ getAccountNumber('special') }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Transfer Amount</div>
                <div class="text-body-1">
                  Amount: TTD ${{ parseFloat(transferDetails.amount).toFixed(2) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="mb-4 rounded-lg">
              <v-card-text>
                <div class="text-caption text-grey mb-1">Description</div>
                <div class="text-body-1">
                  {{ transferDetails.description || 'Transfer for savings' }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" md="4">
            <v-btn
              block
              color="primary"
              variant="flat"
              height="48"
              class="rounded-lg"
              @click="printReceipt"
            >
              Print Receipt
            </v-btn>
          </v-col>

          <v-col cols="12" md="4">
            <v-btn
              block
              color="primary"
              variant="flat"
              height="48"
              class="rounded-lg"
              @click="downloadReceipt"
            >
              Download Receipt
            </v-btn>
          </v-col>

          <v-col cols="12" md="4">
            <v-btn
              block
              color="primary"
              variant="flat"
              height="48"
              class="rounded-lg"
              @click="goToDashboard"
            >
              Go to Dashboard
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps, defineEmits } from 'vue';
import { useTransferStore } from '@/store/transfersStore';
import { useRouter } from 'vue-router';

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['back']);
const router = useRouter();
const transferStore = useTransferStore();
const isOpen = ref(true);
const loading = ref(false);
const currentView = ref('form'); // form, confirmation, completed
const transferType = ref('now');
const transactionId = ref('9578434');

// Form data
const transferDetails = reactive({
  sourceAccount: transferStore.sourceAccount,
  destinationAccount: transferStore.sourceAccount === 'ordinary' ? 'special' : 'ordinary',
  amount: 2000,
  description: 'Transfer for savings',
});

// Format date for transaction
const currentDate = computed(() => {
  const now = new Date();
  return now
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    .replace(/\//g, '-');
});

const currentTime = computed(() => {
  const now = new Date();
  return (
    now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + 'AM'
  );
});

// Helper function to get account number
const getAccountNumber = (accountType) => {
  return accountType === 'ordinary' ? '4587124' : '458471';
};

// Update the store when source account changes
const updateSourceAccount = (newVal) => {
  // Update the destination account when source changes to avoid same account transfers
  if (newVal === transferDetails.destinationAccount) {
    transferDetails.destinationAccount = newVal === 'ordinary' ? 'special' : 'ordinary';
  }

  // Update the source in the store
  transferStore.setSourceAccount(newVal);
};

// Show confirmation before processing
const showConfirmation = (type) => {
  if (!transferDetails.amount || parseFloat(transferDetails.amount) <= 0) {
    // Show validation error (could add an error display)
    alert('Please enter a valid amount');
    return;
  }

  transferType.value = type;
  currentView.value = 'confirmation';
};

// Process transfer
const processTransfer = async (type) => {
  loading.value = true;

  try {
    // Update the store with current form values
    transferStore.updateTransferDetails(transferDetails);

    // Process the transfer in the store
    await transferStore.processTransfer(type);

    // Show completed view
    currentView.value = 'completed';
  } catch (error) {
    console.error('Transfer failed:', error);
    // Handle error (could add error display here)
  } finally {
    loading.value = false;
  }
};

// Receipt functions
const printReceipt = () => {
  console.log('Printing receipt...');
  // Would normally open print dialog with formatted receipt
  window.print();
};

const downloadReceipt = () => {
  console.log('Downloading receipt...');
  // Would normally generate PDF and trigger download
  alert('Receipt has been downloaded');
};

// Navigation
const goToDashboard = () => {
  closeForm();
  // Navigate to accounts dashboard
  emit('back');
};

// Close the form and reset
const closeForm = () => {
  isOpen.value = false;
  emit('back');
};

onMounted(() => {
  // Initialize form with store data
  transferDetails.sourceAccount = transferStore.sourceAccount;
  transferDetails.destinationAccount =
    transferStore.sourceAccount === 'ordinary' ? 'special' : 'ordinary';
});
</script>

<style scoped>
.h-100 {
  height: 100%;
}

.success-icon-container {
  position: relative;
  overflow: hidden;
}

.success-icon-container::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0.6;
  z-index: 0;
}

.confirmation-container,
.completed-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
