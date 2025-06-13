<template>
  <div class="dashboard-accounts">
    <!-- MOBILE ACCOUNTS VIEW -->
    <div v-if="isMobile" class="pa-4">
      <!-- Mobile Section Title -->
      <div v-if="!selectedAccountMobile" class="mb-4">
        <div class="text-h6">My Accounts</div>
        <div class="text-subtitle-2 text-grey">View and manage your accounts</div>
      </div>

      <!-- Mobile Account List View - When no account is selected -->
      <div v-if="!selectedAccountMobile">
        <!-- Account Cards in Mobile View -->
        <v-card
          class="mb-4 rounded-xl mobile-account-card elevation-1"
          @click="viewAccountDetailsMobile('ordinary')"
        >
          <div class="d-flex flex-column pa-4">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-subtitle-1 font-weight-bold primary--text">
                Ordinary Shares Account
              </div>
              <v-chip size="small" color="primary" text-color="white" class="font-weight-medium"
                >Active</v-chip
              >
            </div>
            <div class="text-caption text-grey mb-3">No. 4587124</div>

            <div class="d-flex justify-space-between align-start mt-2">
              <div>
                <div class="text-caption text-grey">Current Balance</div>
                <div class="text-h6 primary--text font-weight-bold">TTD $252,250.12</div>
              </div>
              <v-icon color="primary" size="24">mdi-chevron-right</v-icon>
            </div>
          </div>
        </v-card>

        <v-card
          class="mb-4 rounded-xl mobile-account-card elevation-1"
          @click="viewAccountDetailsMobile('special')"
        >
          <div class="d-flex flex-column pa-4">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-subtitle-1 font-weight-bold primary--text">
                Special Shares Account
              </div>
              <v-chip size="small" color="primary" text-color="white" class="font-weight-medium"
                >Active</v-chip
              >
            </div>
            <div class="text-caption text-grey mb-3">No. 458718</div>

            <div class="d-flex justify-space-between align-start mt-2">
              <div>
                <div class="text-caption text-grey">Current Balance</div>
                <div class="text-h6 primary--text font-weight-bold">TTD $15,525.00</div>
              </div>
              <v-icon color="primary" size="24">mdi-chevron-right</v-icon>
            </div>
          </div>
        </v-card>

        <!-- Quick Actions Section -->
        <div class="mt-8 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-3">Quick Actions</div>
          <div class="d-flex justify-space-between">
            <v-card
              width="48%"
              class="text-center pa-4 rounded-xl"
              variant="outlined"
              @click="navigateTo('transfers')"
            >
              <v-icon color="primary" size="32" class="mb-2">mdi-bank-transfer</v-icon>
              <div class="text-body-2">Transfer</div>
            </v-card>
            <v-card width="48%" class="text-center pa-4 rounded-xl" variant="outlined">
              <v-icon color="primary" size="32" class="mb-2">mdi-file-document</v-icon>
              <div class="text-body-2">Statements</div>
            </v-card>
          </div>
        </div>
      </div>

      <!-- Mobile Account Details View - When an account is selected -->
      <div v-else>
        <!-- Mobile Account Details Header -->
        <div class="d-flex align-center mb-4">
          <v-btn icon class="mr-2" @click="selectedAccountMobile = null">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <div class="text-h6">
              {{ selectedAccountMobile === 'ordinary' ? 'Ordinary Shares' : 'Special Shares' }}
            </div>
            <div class="text-caption text-grey">
              {{ selectedAccountMobile === 'ordinary' ? 'No. 4587124' : 'No. 458718' }}
            </div>
          </div>
        </div>

        <!-- Mobile Account Balance Card -->
        <v-card class="mb-4 rounded-xl balance-card" color="primary" theme="dark">
          <v-card-text class="pa-4">
            <div class="text-caption text-white text-opacity-70 mb-1">Current Balance</div>
            <div class="text-h5 font-weight-bold">
              {{ selectedAccountMobile === 'ordinary' ? 'TTD $252,250.12' : 'TTD $15,525.00' }}
            </div>
            <div class="d-flex justify-space-between mt-4">
              <div>
                <div class="text-caption text-white text-opacity-70">Available</div>
                <div class="text-subtitle-2 font-weight-medium">
                  {{ selectedAccountMobile === 'ordinary' ? 'TTD $252,250.12' : 'TTD $10,300.00' }}
                </div>
              </div>
              <div>
                <div class="text-caption text-white text-opacity-70">Account Number</div>
                <div class="text-subtitle-2 font-weight-medium">
                  {{ selectedAccountMobile === 'ordinary' ? '4587124' : '458718' }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Mobile Transaction Filters -->
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-subtitle-1 font-weight-bold">Transactions</div>
          <v-chip color="primary" variant="outlined" class="font-weight-medium">
            <v-icon start size="small">mdi-calendar</v-icon>
            Last 30 Days
          </v-chip>
        </div>

        <!-- Mobile Transaction Printing Options -->
        <div class="d-flex justify-end mb-4">
          <v-btn color="primary" class="mr-2" variant="text" size="small">
            <v-icon start size="small">mdi-printer</v-icon>
            Print
          </v-btn>
          <v-btn color="primary" variant="text" size="small">
            <v-icon start size="small">mdi-download</v-icon>
            Download
          </v-btn>
        </div>

        <!-- Mobile Transaction List -->
        <v-card
          v-for="(transaction, index) in filteredTransactions.slice(0, 5)"
          :key="index"
          class="mb-3 rounded-lg transaction-item"
          variant="outlined"
        >
          <v-card-text class="py-3 px-4">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="36" class="mr-3" variant="tonal">
                  <v-icon color="primary" size="small">
                    {{
                      transaction.status === 'Withdrawal'
                        ? 'mdi-cash-minus'
                        : transaction.status === 'Bill Payment'
                          ? 'mdi-file-document'
                          : 'mdi-cash-plus'
                    }}
                  </v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ transaction.status }}
                  </div>
                  <div class="text-caption text-grey">{{ transaction.location }}</div>
                </div>
              </div>
              <div class="d-flex flex-column align-end">
                <div
                  class="text-subtitle-2 font-weight-bold"
                  :class="{
                    'text-error':
                      transaction.status === 'Withdrawal' || transaction.status === 'Bill Payment',
                    'text-success': transaction.status === 'Deposit',
                  }"
                >
                  {{
                    transaction.status === 'Withdrawal' || transaction.status === 'Bill Payment'
                      ? '- ' + transaction.amount
                      : '+ ' + transaction.amount
                  }}
                </div>
                <div class="text-caption text-grey">{{ transaction.date }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- View All Transactions -->
        <div class="text-center mt-4 mb-6">
          <v-btn color="primary" variant="outlined" class="rounded-pill">
            View All Transactions
            <v-icon end>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- DESKTOP ACCOUNTS VIEW -->
    <v-container v-else fluid class="pa-0 fill-height">
      <v-row class="fill-height ma-0">
        <!-- Left Side - Account Selection -->
        <v-col cols="12" md="4" lg="3" xl="3" class="bg-white py-6 px-4">
          <div class="text-h6 mb-6">My Accounts</div>

          <v-card
            class="mb-4 rounded-lg account-card border-start-accent"
            variant="outlined"
            :class="{ 'selected-account': selectedAccount === 'ordinary' }"
            style="border-left: 4px solid #5c6bc0"
            @click="selectAccount('ordinary')"
          >
            <v-card-item>
              <div class="text-subtitle-1 font-weight-bold">Ordinary Shares Account</div>
              <div class="text-body-2 text-grey">587124</div>
            </v-card-item>
            <v-card-text class="pt-0">
              <div class="d-flex flex-column">
                <div class="mb-2">
                  <div class="text-caption text-grey mb-1">Current Balance</div>
                  <div class="text-subtitle-2">TTD $252,250.12</div>
                </div>
                <div>
                  <div class="text-caption text-grey mb-1">Available Balance</div>
                  <div class="text-subtitle-2">TTD $252,250.12</div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card
            class="mb-4 rounded-lg account-card border-start-accent"
            variant="outlined"
            :class="{ 'selected-account': selectedAccount === 'special' }"
            style="border-left: 4px solid #5c6bc0"
            @click="selectAccount('special')"
          >
            <v-card-item>
              <div class="text-subtitle-1 font-weight-bold">Special Shares Account</div>
              <div class="text-body-2 text-grey">587718</div>
            </v-card-item>
            <v-card-text class="pt-0">
              <div class="d-flex flex-column">
                <div class="mb-2">
                  <div class="text-caption text-grey mb-1">Current Balance</div>
                  <div class="text-subtitle-2">TTD $15,525.00</div>
                </div>
                <div>
                  <div class="text-caption text-grey mb-1">Available Balance</div>
                  <div class="text-subtitle-2">TTD $10,300.00</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Side - Account Details -->
        <v-col cols="12" md="8" lg="9" xl="9" class="pa-6 bg-grey-lighten-3">
          <div class="d-flex justify-space-between mb-6">
            <div class="text-h6">Account Details</div>
            <div>
              <v-btn color="primary" class="mr-2" variant="flat" size="small">
                <v-icon start size="small">mdi-printer</v-icon>
                Print
              </v-btn>
              <v-btn color="primary" variant="flat" size="small">
                <v-icon start size="small">mdi-download</v-icon>
                Download
              </v-btn>
            </div>
          </div>

          <div v-if="selectedAccount">
            <!-- Selected Account Details -->
            <v-row class="mb-6">
              <v-col cols="12" md="6">
                <v-card class="h-100" variant="outlined">
                  <v-card-text>
                    <div class="text-caption text-grey mb-1">CURRENT BALANCE</div>
                    <div v-if="selectedAccount === 'ordinary'" class="text-h6 primary-text">
                      TTD $252,250.12
                    </div>
                    <div v-else class="text-h6 primary-text">TTD $15,525.00</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="h-100" variant="outlined">
                  <v-card-text>
                    <div class="text-caption text-grey mb-1">AVAILABLE BALANCE</div>
                    <div v-if="selectedAccount === 'ordinary'" class="text-h6 primary-text">
                      TTD $252,250.12
                    </div>
                    <div v-else class="text-h6 primary-text">TTD $10,300.00</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Account History Section -->
            <div class="mb-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="text-subtitle-1 font-weight-bold">Account History</div>
                <v-chip color="primary" variant="outlined" class="font-weight-medium">
                  <v-icon start size="small">mdi-calendar</v-icon>
                  Last 30 Days
                </v-chip>
              </div>

              <!-- Account Summary Cards -->
              <v-row>
                <v-col cols="12" sm="4">
                  <v-card variant="outlined" class="rounded-lg summary-card h-100">
                    <v-card-text class="text-center">
                      <div class="text-caption text-grey mb-1">TOTAL DEPOSITS</div>
                      <div class="text-h6 text-success">+ TTD $2,500.00</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card variant="outlined" class="rounded-lg summary-card h-100">
                    <v-card-text class="text-center">
                      <div class="text-caption text-grey mb-1">TOTAL WITHDRAWALS</div>
                      <div class="text-h6 text-error">- TTD $1,925.00</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card variant="outlined" class="rounded-lg summary-card h-100">
                    <v-card-text class="text-center">
                      <div class="text-caption text-grey mb-1">NET CHANGE</div>
                      <div class="text-h6 text-primary">+ TTD $575.00</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <!-- Recent Transactions Section -->
            <div class="mb-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="text-subtitle-1 font-weight-bold">Recent Transactions</div>
                <v-btn variant="text" color="primary" size="small">
                  <v-icon start size="small">mdi-filter-variant</v-icon>
                  Filter
                </v-btn>
              </div>

              <!-- Transaction Cards -->
              <div class="desktop-transactions">
                <v-card
                  v-for="(transaction, index) in transactions.slice(0, 5)"
                  :key="index"
                  class="mb-3 rounded-lg transaction-item"
                  variant="outlined"
                >
                  <v-card-text class="py-3 px-4">
                    <div class="d-flex justify-space-between align-center">
                      <div class="d-flex align-center">
                        <v-avatar color="primary" size="36" class="mr-3" variant="tonal">
                          <v-icon color="primary" size="small">
                            {{
                              transaction.status === 'Withdrawal'
                                ? 'mdi-cash-minus'
                                : transaction.status === 'Bill Payment'
                                  ? 'mdi-file-document'
                                  : 'mdi-cash-plus'
                            }}
                          </v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-2 font-weight-medium">
                            {{ transaction.status }}
                          </div>
                          <div class="text-caption text-grey">{{ transaction.location }}</div>
                        </div>
                      </div>
                      <div class="d-flex flex-column align-end">
                        <div
                          class="text-subtitle-2 font-weight-bold"
                          :class="{
                            'text-error':
                              transaction.status === 'Withdrawal' ||
                              transaction.status === 'Bill Payment',
                            'text-success': transaction.status === 'Deposit',
                          }"
                        >
                          {{
                            transaction.status === 'Withdrawal' ||
                            transaction.status === 'Bill Payment'
                              ? '- ' + transaction.amount
                              : '+ ' + transaction.amount
                          }}
                        </div>
                        <div class="text-caption text-grey">{{ transaction.date }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <!-- View All Transactions -->
              <div class="text-center mt-4">
                <v-btn color="primary" variant="outlined" class="rounded-pill">
                  View All Transactions
                  <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>

            <!-- Transaction History Filter -->
            <v-card variant="outlined" class="mt-6 mb-4 rounded-lg">
              <v-card-title class="py-3 bg-grey-lighten-4">
                <div class="d-flex justify-space-between align-center">
                  <div class="text-subtitle-1 font-weight-bold">Advanced Search</div>
                  <v-btn variant="text" color="primary" size="small">
                    <v-icon start size="small">mdi-refresh</v-icon>
                    Reset
                  </v-btn>
                </div>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      density="compact"
                      variant="outlined"
                      label="Sort by"
                      class="mb-2"
                      :items="['Date', 'Amount', 'Type']"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="dateFrom"
                      density="compact"
                      variant="outlined"
                      class="mb-2 date-field"
                      label="From Date"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="dateTo"
                      density="compact"
                      variant="outlined"
                      class="mb-2 date-field"
                      label="To Date"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      density="compact"
                      variant="outlined"
                      label="Transaction Type"
                      class="mb-2"
                      :items="['All', 'Withdrawal', 'Deposit', 'Bill Payment']"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="searchQuery"
                      density="compact"
                      variant="outlined"
                      prepend-inner-icon="mdi-magnify"
                      placeholder="Search transactions..."
                      class="mb-2"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Transaction Table for Full History -->
            <v-card variant="outlined" class="transaction-table mt-4 rounded-lg">
              <v-card-title class="py-3 bg-grey-lighten-4">Transaction History</v-card-title>
              <v-data-table
                :headers="transactionHeaders"
                :items="filteredTransactions"
                :search="searchQuery"
                class="transactions-table elevation-0"
                :items-per-page="10"
              ></v-data-table>
            </v-card>
          </div>

          <div v-else class="account-empty-state">
            <v-card
              height="300"
              class="d-flex flex-column align-center justify-center"
              color="grey-lighten-3"
              variant="outlined"
            >
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bank</v-icon>
              <div class="text-h6 text-grey text-center px-4">
                Select an account from the left to view details
              </div>
              <v-btn color="primary" variant="flat" class="mt-6" @click="selectAccount('ordinary')">
                View Ordinary Shares
              </v-btn>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['navigate']);
const selectedAccount = ref(null);
const selectedAccountMobile = ref(null);
const searchQuery = ref('');
const dateFrom = ref('01 Jan 2024');
const dateTo = ref('01 Feb 2024');

// Transaction table headers
const transactionHeaders = [
  { title: 'Date', key: 'date', align: 'start' },
  { title: 'Status', key: 'status' },
  { title: 'Location', key: 'location' },
  { title: 'Amount', key: 'amount', align: 'end' },
];

// Sample transaction data
const transactions = ref([
  {
    date: 'Feb 10, 2024',
    status: 'Withdrawal',
    location: 'Windler, Aranjuez, San Juan',
    amount: 'TTD 700.00',
  },
  {
    date: 'Feb 10, 2024',
    status: 'Bill Payment',
    location: 'DonDonald, Belmont, Port-of-Spain',
    amount: 'TTD 225.00',
  },
  {
    date: 'Feb 13, 2024',
    status: 'Withdrawal',
    location: 'Windler, Aranjuez, San Juan',
    amount: 'TTD 350.00',
  },
  {
    date: 'Feb 20, 2024',
    status: 'Deposit',
    location: 'Cathedral Credit Union, San Juan',
    amount: 'TTD 1,500.00',
  },
  {
    date: 'Mar 11, 2024',
    status: 'Withdrawal',
    location: 'Windler, Aranjuez, San Juan',
    amount: 'TTD 100.00',
  },
  {
    date: 'Mar 15, 2024',
    status: 'Withdrawal',
    location: 'Windler, Aranjuez, San Juan',
    amount: 'TTD 300.00',
  },
  {
    date: 'Apr 5, 2024',
    status: 'Deposit',
    location: 'Cathedral Credit Union, San Juan',
    amount: 'TTD 1,000.00',
  },
  {
    date: 'Apr 15, 2024',
    status: 'Bill Payment',
    location: 'DonDonald, Belmont, Port-of-Spain',
    amount: 'TTD 500.00',
  },
  {
    date: 'Apr 20, 2024',
    status: 'Withdrawal',
    location: 'Windler, Aranjuez, San Juan',
    amount: 'TTD 650.00',
  },
  {
    date: 'May 11, 2024',
    status: 'Withdrawal',
    location: 'Windler, Aranjuez, San Juan',
    amount: 'TTD 500.00',
  },
  {
    date: 'May 15, 2024',
    status: 'Withdrawal',
    location: 'Windler, Aranjuez, San Juan',
    amount: 'TTD 150.00',
  },
]);

// Function to view account details in mobile view
const viewAccountDetailsMobile = (account) => {
  selectedAccountMobile.value = account;
};

// Function to select account in desktop view
const selectAccount = (account) => {
  selectedAccount.value = account;
};

// Navigate to different sections
const navigateTo = (section) => {
  emit('navigate', section);
};

// Filtered transactions based on search query
const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value;

  return transactions.value.filter((transaction) => {
    return (
      transaction.date.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});
</script>

<style scoped>
.dashboard-accounts {
  height: 100%;
  width: 100%;
}

.h-100 {
  height: 100%;
}

.account-card {
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  cursor: pointer;
}

.account-card:hover {
  border-color: #5c6bc0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selected-account {
  border: 2px solid #5c6bc0;
  background-color: rgba(92, 107, 192, 0.05);
}

.primary-text {
  color: #5c6bc0;
}

.border-start-accent {
  position: relative;
}

.date-field {
  cursor: pointer;
}

.transaction-table :deep(table) {
  border-collapse: separate;
  border-spacing: 0;
}

.transaction-table :deep(th) {
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  font-size: 0.8rem;
  text-transform: uppercase;
  padding: 16px;
}

.mobile-account-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.mobile-account-card:active {
  transform: scale(0.98);
}

.balance-card {
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.balance-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0.8;
  z-index: 0;
}

.transaction-item {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.transaction-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.text-success {
  color: #4caf50 !important;
}

.text-error {
  color: #f44336 !important;
}

.summary-card {
  transition: all 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.account-empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 768px) {
  .dashboard-accounts {
    overflow-y: auto;
  }
}
</style>
