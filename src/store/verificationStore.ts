import { defineStore } from 'pinia';

export const useVerificationStore = defineStore('verification', {
  state: () => ({
    email: {
      isVerified: false,
      verifiedOn: null,
      verificationInProgress: false,
      attemptCount: 0,
      error: null,
      operationType: null, // 'signup', 'login', etc.
    },
    mobile: {
      isVerified: false,
      verifiedOn: null,
      verificationInProgress: false,
      attemptCount: 0,
      error: null,
      operationType: null, // 'signup', 'login', etc.
    },
  }),

  getters: {
    isEmailVerified: (state) => state.email.isVerified,
    isMobileVerified: (state) => state.mobile.isVerified,
    emailVerifiedOn: (state) => state.email.verifiedOn,
    mobileVerifiedOn: (state) => state.mobile.verifiedOn,
    isEmailVerificationInProgress: (state) => state.email.verificationInProgress,
    isMobileVerificationInProgress: (state) => state.mobile.verificationInProgress,
    emailError: (state) => state.email.error,
    mobileError: (state) => state.mobile.error,
    emailOperationType: (state) => state.email.operationType,
    mobileOperationType: (state) => state.mobile.operationType,
  },

  actions: {
    setVerificationError(type, error) {
      if (type in this) {
        this[type].error = error;
      }
    },

    clearVerificationError(type) {
      if (type in this) {
        this[type].error = null;
      }
    },

    startVerification(type, operationType) {
      if (type in this) {
        this[type].verificationInProgress = true;
        this[type].attemptCount += 1;
        this[type].error = null;
        this[type].operationType = operationType;
      }
    },

    completeVerification(type, verifiedOn = null) {
      if (type in this) {
        this[type].isVerified = true;
        this[type].verifiedOn = verifiedOn || new Date().toISOString();
        this[type].verificationInProgress = false;

        // Save to localStorage for persistence
        this.saveToLocalStorage();
      }
    },

    cancelVerification(type) {
      if (type in this) {
        this[type].verificationInProgress = false;
      }
    },

    resetVerification(type) {
      if (type in this) {
        this[type].isVerified = false;
        this[type].verifiedOn = null;
        this[type].verificationInProgress = false;
        this[type].attemptCount = 0;
        this[type].error = null;
        this[type].operationType = null;

        // Update localStorage after reset
        this.saveToLocalStorage();
      }
    },

    saveToLocalStorage() {
      localStorage.setItem(
        'verification_state',
        JSON.stringify({
          email: {
            isVerified: this.email.isVerified,
            verifiedOn: this.email.verifiedOn,
          },
          mobile: {
            isVerified: this.mobile.isVerified,
            verifiedOn: this.mobile.verifiedOn,
          },
        })
      );
    },

    loadFromLocalStorage() {
      const stored = localStorage.getItem('verification_state');
      if (stored) {
        const data = JSON.parse(stored);

        if (data.email) {
          this.email.isVerified = data.email.isVerified || false;
          this.email.verifiedOn = data.email.verifiedOn || null;
        }

        if (data.mobile) {
          this.mobile.isVerified = data.mobile.isVerified || false;
          this.mobile.verifiedOn = data.mobile.verifiedOn || null;
        }
      }
    },
  },
});
