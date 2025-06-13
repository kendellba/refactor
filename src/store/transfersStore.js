import { defineStore } from 'pinia';

export const useTransferStore = defineStore('transfers', {
  state: () => ({
    sourceAccount: 'ordinary',
    selectedTransferType: null,
    transferDetails: {
      sourceAccount: 'ordinary',
      destinationAccount: 'special',
      amount: null,
      description: '',
    },
    recentTransfers: [
      {
        id: 1,
        recipient: 'John Smith',
        date: '20 Apr 2024',
        amount: 'TTD $500.00',
        icon: 'mdi-account',
        type: 'member',
      },
      {
        id: 2,
        recipient: 'Own Account',
        date: '15 Apr 2024',
        amount: 'TTD $1,000.00',
        icon: 'mdi-bank-transfer',
        type: 'self',
      },
    ],
  }),

  actions: {
    setSourceAccount(account) {
      this.sourceAccount = account;
    },

    setSelectedTransferType(type) {
      this.selectedTransferType = type;
    },

    updateTransferDetails(details) {
      this.transferDetails = {
        ...this.transferDetails,
        ...details,
      };
    },

    resetTransferDetails() {
      this.transferDetails = {
        sourceAccount: this.sourceAccount,
        destinationAccount: this.sourceAccount === 'ordinary' ? 'special' : 'ordinary',
        amount: null,
        description: '',
      };
    },

    processTransfer(type) {
      // Here you would typically make an API call to process the transfer
      // For this demo, we're just simulating a successful transfer

      // Add to recent transfers
      const newTransfer = {
        id: Date.now(),
        recipient:
          this.transferDetails.destinationAccount === 'ordinary'
            ? 'Ordinary Shares Account'
            : 'Special Shares Account',
        date: new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        amount: `TTD $${parseFloat(this.transferDetails.amount).toFixed(2)}`,
        icon: 'mdi-bank-transfer',
        type: 'self',
      };

      this.recentTransfers.unshift(newTransfer);

      // Reset form
      this.resetTransferDetails();

      return Promise.resolve(newTransfer);
    },
  },

  getters: {
    getSourceAccount: (state) => state.sourceAccount,
    getSelectedTransferType: (state) => state.selectedTransferType,
    getTransferDetails: (state) => state.transferDetails,
    getRecentTransfers: (state) => state.recentTransfers,

    getAccountOptions: () => [
      { title: 'Ordinary Shares Account - TTD $252,250.12', value: 'ordinary' },
      { title: 'Special Shares Account - TTD $10,300.00', value: 'special' },
    ],

    getDestinationOptions: (state) => {
      return state.transferDetails.sourceAccount === 'ordinary'
        ? [{ title: 'Special Shares Account - TTD $10,300.00', value: 'special' }]
        : [{ title: 'Ordinary Shares Account - TTD $252,250.12', value: 'ordinary' }];
    },
  },
});
