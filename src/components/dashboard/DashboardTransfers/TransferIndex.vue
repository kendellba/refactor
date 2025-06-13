<template>
  <div>
    <!-- Mobile View -->
    <div v-if="isMobile" class="pa-4">
      <div class="text-center mb-4">
        <div class="text-h6 mb-2">Transfers</div>
        <div class="text-body-2 text-grey">
          Make transfers to your accounts, other members and also external parties.
        </div>
      </div>

      <!-- Source Account Selection -->
      <v-card variant="outlined" class="mb-4 rounded-lg">
        <v-card-title class="d-flex align-center py-3">
          <v-icon start class="mr-2">mdi-bank</v-icon>
          Source Account
        </v-card-title>
        <v-card-text class="pt-0 pb-3">
          <v-select
            v-model="transferStore.sourceAccount"
            label="Select account to transfer from"
            :items="transferStore.getAccountOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            class="mb-0"
            @update:model-value="transferStore.setSourceAccount"
          ></v-select>
        </v-card-text>
      </v-card>

      <!-- Transfer Action Buttons -->
      <v-card
        v-for="option in transferOptions"
        :key="option.type"
        color="primary"
        class="mb-3 rounded-lg elevation-1 text-white mobile-transfer-btn"
        variant="flat"
        @click="selectTransferType(option.type)"
      >
        <v-card-text class="d-flex align-center py-4">
          <v-avatar color="white" size="36" class="mr-3" variant="tonal">
            <v-icon color="primary">{{ option.icon }}</v-icon>
          </v-avatar>
          <div class="flex-1">
            <div class="font-weight-medium">{{ option.title }}</div>
            <div class="text-caption text-white text-opacity-75">
              {{ option.description }}
            </div>
          </div>
          <v-icon>mdi-chevron-right</v-icon>
        </v-card-text>
      </v-card>

      <!-- Recent Transfers -->
      <div class="mt-5 mb-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <div class="text-subtitle-1 font-weight-bold">Recent Transfers</div>
          <v-btn variant="text" color="primary" density="comfortable" size="small">
            View All
            <v-icon end size="small">mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <v-list class="pa-0 mb-4 rounded-lg" variant="outlined">
          <v-list-item
            v-for="transfer in transferStore.getRecentTransfers.slice(0, 2)"
            :key="transfer.id"
          >
            <template #prepend>
              <v-avatar color="primary" size="36" variant="tonal">
                <v-icon color="primary" size="small">{{ transfer.icon }}</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title>{{ transfer.recipient }}</v-list-item-title>
            <v-list-item-subtitle>{{ transfer.date }}</v-list-item-subtitle>
            <template #append>
              <div class="text-subtitle-2 font-weight-bold">{{ transfer.amount }}</div>
            </template>
          </v-list-item>
        </v-list>
      </div>

      <!-- Back Button -->
      <v-card
        color="orange"
        class="rounded-lg elevation-1 text-center text-white"
        variant="flat"
        @click="navigateBack"
      >
        <v-card-text class="py-4">
          <v-icon start>mdi-arrow-left</v-icon>
          Back to Accounts
        </v-card-text>
      </v-card>
    </div>

    <!-- Desktop View -->
    <div v-else class="pa-6">
      <div class="mb-6">
        <div class="text-h6">Transfer Center</div>
        <div class="text-body-2 text-grey">
          Make transfers to your accounts, other members and also external parties.
        </div>
      </div>

      <!-- Two column layout for desktop -->
      <v-row>
        <!-- Left column - Source Account Selection -->
        <v-col cols="12" md="5" lg="4" xl="3">
          <v-card class="mb-4" variant="outlined">
            <v-card-title class="py-3 bg-grey-lighten-4">
              <v-icon start>mdi-bank</v-icon>
              Source Account
            </v-card-title>
            <v-card-text class="px-3 pt-3 pb-0">
              <div class="text-subtitle-2 mb-2">Select the account to transfer from:</div>

              <v-radio-group
                v-model="transferStore.sourceAccount"
                hide-details
                @update:model-value="transferStore.setSourceAccount"
              >
                <v-card
                  variant="outlined"
                  class="mb-3 rounded-lg account-select-card"
                  @click="transferStore.setSourceAccount('ordinary')"
                >
                  <v-card-text class="pa-3">
                    <v-radio value="ordinary" class="mb-0 mt-0">
                      <template #label>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">
                            Ordinary Shares Account
                          </div>
                          <div class="text-caption text-grey">Account No: 587124</div>
                          <div class="text-subtitle-2 mt-1">
                            Available Balance:
                            <span class="font-weight-bold">TTD $252,250.12</span>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </v-card-text>
                </v-card>

                <v-card
                  variant="outlined"
                  class="mb-3 rounded-lg account-select-card"
                  @click="transferStore.setSourceAccount('special')"
                >
                  <v-card-text class="pa-3">
                    <v-radio value="special" class="mb-0 mt-0">
                      <template #label>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Special Shares Account</div>
                          <div class="text-caption text-grey">Account No: 587718</div>
                          <div class="text-subtitle-2 mt-1">
                            Available Balance:
                            <span class="font-weight-bold">TTD $10,300.00</span>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </v-card-text>
                </v-card>
              </v-radio-group>
            </v-card-text>
          </v-card>

          <!-- Recent Transfers -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="py-3 bg-grey-lighten-4">
              <v-icon start>mdi-history</v-icon>
              Recent Transfers
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list>
                <template
                  v-for="(transfer, index) in transferStore.getRecentTransfers.slice(0, 2)"
                  :key="transfer.id"
                >
                  <v-list-item>
                    <template #prepend>
                      <v-avatar color="primary" size="36" variant="tonal">
                        <v-icon color="primary" size="small">{{ transfer.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ transfer.recipient }}</v-list-item-title>
                    <v-list-item-subtitle>{{ transfer.date }}</v-list-item-subtitle>
                    <template #append>
                      <div class="text-subtitle-2 font-weight-bold">{{ transfer.amount }}</div>
                    </template>
                  </v-list-item>
                  <v-divider v-if="index < transferStore.getRecentTransfers.length - 1"></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right column - Transfer Options -->
        <v-col cols="12" md="7" lg="8" xl="9">
          <v-card class="mb-4" variant="outlined">
            <v-card-title class="py-3 bg-grey-lighten-4">
              <v-icon start>mdi-bank-transfer</v-icon>
              Transfer Options
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="option in transferOptions" :key="option.type" cols="12" sm="6" md="4">
                  <v-card
                    class="transfer-option-card text-center mb-4"
                    height="150"
                    variant="flat"
                    color="primary"
                    theme="dark"
                    :class="{
                      'transfer-option-selected':
                        transferStore.selectedTransferType === option.type,
                    }"
                    @click="selectTransferType(option.type)"
                  >
                    <v-card-text class="d-flex flex-column align-center justify-center fill-height">
                      <v-icon size="36" class="mb-2">{{ option.icon }}</v-icon>
                      <div class="text-subtitle-1 font-weight-medium">{{ option.title }}</div>
                      <div class="text-caption">{{ option.description }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Dynamic Component for Selected Transfer Type -->
    <component
      :is="selectedComponent"
      v-if="transferStore.selectedTransferType"
      :is-mobile="isMobile"
      @back="transferStore.setSelectedTransferType(null)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, type ComputedRef } from 'vue';
import { useTransferStore } from '@/store/transfersStore';
import TransferToSelf from './TransferToSelf.vue';
import TransferToMember from './TransferToMember.vue';
import TransferToExternal from './TransferToExternal.vue';
import TransferToInternational from './TransferToInternational.vue';
import ManagePayees from './ManagePayees.vue';
import ScheduledTransfers from './ScheduledTransfers.vue';

interface Props {
  isMobile?: boolean;
}

interface TransferOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  component: string;
  color: string;
  type: string;
}

withDefaults(defineProps<Props>(), {
  isMobile: false,
});

const emit = defineEmits(['navigate']);
const transferStore = useTransferStore();

const activeComponent: Ref<string | null> = ref(null);
const isLoading: Ref<boolean> = ref(false);

const transferOptions: TransferOption[] = [
  {
    id: 'self',
    type: 'self',
    title: 'Transfer to Self',
    subtitle: 'Between your accounts',
    description: 'Transfer between your accounts',
    icon: 'mdi-account-arrow-right',
    component: 'TransferToSelf',
    color: 'primary'
  },
  {
    id: 'member',
    type: 'member',
    title: 'Transfer to Member',
    subtitle: 'To another member',
    description: 'Transfer to another member',
    icon: 'mdi-account-group',
    component: 'TransferToMember',
    color: 'success'
  },
  {
    id: 'external',
    type: 'external',
    title: 'Transfer to External',
    subtitle: 'To external bank',
    description: 'Transfer to external bank',
    icon: 'mdi-bank-outline',
    component: 'TransferToExternal',
    color: 'warning'
  },
  {
    id: 'international',
    type: 'international',
    title: 'International Transfer',
    subtitle: 'Worldwide transfers',
    description: 'International transfers',
    icon: 'mdi-earth',
    component: 'TransferToInternational',
    color: 'info'
  },
  {
    id: 'payees',
    type: 'payees',
    title: 'Manage Payees',
    subtitle: 'Manage recipients',
    description: 'Manage payee recipients',
    icon: 'mdi-account-multiple',
    component: 'ManagePayees',
    color: 'secondary'
  },
  {
    id: 'scheduled',
    type: 'scheduled',
    title: 'Scheduled Transfers',
    subtitle: 'View scheduled',
    description: 'View scheduled transfers',
    icon: 'mdi-calendar-clock',
    component: 'ScheduledTransfers',
    color: 'purple'
  }
];

const selectedComponent: ComputedRef<string | null> = computed(() => {
  return activeComponent.value;
});

const selectTransferType = (optionType: string): void => {
  const option = transferOptions.find(opt => opt.type === optionType);
  if (option) {
    activeComponent.value = option.component;
  }
};

const selectTransferOption = (optionId: string): void => {
  const option = transferOptions.find(opt => opt.id === optionId);
  if (option) {
    activeComponent.value = option.component;
  }
};

const goBack = (): void => {
  activeComponent.value = null;
};

const handleTransferComplete = (result: any): void => {
  console.log('Transfer completed:', result);
  goBack();
};

const navigateBack = () => {
  emit('navigate', 'accounts');
};
</script>

<style scoped>
.flex-1 {
  flex: 1;
}

.transfer-option-card {
  border-radius: 12px;
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
}

.transfer-option-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0.4;
  z-index: 0;
}

.transfer-option-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.transfer-option-selected {
  box-shadow:
    0 0 0 3px rgba(92, 107, 192, 0.6),
    0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.account-select-card {
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
}

.account-select-card:hover {
  border-color: #5c6bc0;
  background-color: rgba(92, 107, 192, 0.05);
  cursor: pointer;
}

.mobile-transfer-btn {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.mobile-transfer-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0.4;
  z-index: 0;
}

.mobile-transfer-btn:active {
  transform: scale(0.98);
}

.mobile-transfer-btn .v-card-text > * {
  position: relative;
  z-index: 1;
}
</style>
