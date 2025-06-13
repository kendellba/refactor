import { defineStore } from 'pinia';
import { authService } from '@/shared/services/api';
import { v4 as uuidv4 } from 'uuid';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('jwtToken'),
    jwtToken: localStorage.getItem('jwtToken') || null,
    tokenExpiry: null,
    isInitialized: false,
    // Keep for backwards compatibility
    tempEmail: '',
    // Add a users array to store registered users
    users: [],
  }),

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userEmail: (state) => state.user?.email,
    userName: (state) => state.user?.name,
    userRole: (state) => state.user?.role,
    getToken: (state) => state.jwtToken,
  },

  actions: {
    async login(userData) {
      // Store user data
      this.user = userData;
      this.isAuthenticated = true;

      // Get token from localStorage (already set by authService.login)
      this.jwtToken = localStorage.getItem('jwtToken');

      // Persist user to localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return true;
    },

    logout() {
      // Use auth service logout to clear tokens
      authService.logout();

      // Clear state
      this.user = null;
      this.isAuthenticated = false;
      this.jwtToken = null;
      this.tokenExpiry = null;
      this.tempEmail = '';
    },

    // Initialize auth state from localStorage
    initAuth() {
      const jwtToken = localStorage.getItem('jwtToken');
      const storedUsers = localStorage.getItem('users');

      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }

      if (jwtToken) {
        this.jwtToken = jwtToken;
        this.isAuthenticated = true;

        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        }

        // Verify token validity
        this.verifyToken();
      }

      // Mark initialization as complete
      this.isInitialized = true;
    },

    // Verify token is valid
    async verifyToken() {
      if (!this.jwtToken) return false;

      try {
        const isValid = await authService.verifyToken();
        if (!isValid) {
          // If token is invalid, logout
          this.logout();
          return false;
        }
        return true;
      } catch (error) {
        // Removed or sanitized console.error statements for security
        return false;
      }
    },

    // Update token (e.g. when refreshed)
    updateToken(newToken) {
      this.jwtToken = newToken;
      localStorage.setItem('jwtToken', newToken);
    },

    // For backward compatibility
    setTempEmail(email) {
      this.tempEmail = email;
    },

    // Mock API: Create user from signup data (kept for backward compatibility)
    createUserFromSignup(signupData) {
      // Generate a UUID for user ID
      const userId = uuidv4();

      // Create user object from signup data
      const newUser = {
        id: userId,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        middle_name: signupData.otherName || null,
        email: signupData.email,
        mobile: signupData.mobileNumber,
        gender: signupData.gender,
        dob: signupData.dob,
        nationality: signupData.nationality,
        marital_status: signupData.maritalStatus || 'Single',
        school_name: signupData.schoolName,
        is_homeschooled: signupData.isHomeschooled || false,
        has_foreign_bank_account: signupData.hasForeignBankAccount || false,
        created_at: new Date().toISOString(),
      };

      // Add user to users array
      this.users.push({
        ...newUser,
        password: signupData.password, // Store password for login simulation
      });

      // Save users to localStorage
      localStorage.setItem('users', JSON.stringify(this.users));

      return {
        success: true,
        user_id: userId,
      };
    },
  },
});
