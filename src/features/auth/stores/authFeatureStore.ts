import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser as loginUserService } from '@/features/auth/services/auth-api.ts';
import { useAuthStore as useRootAuthStore } from '@/store/authStore'; // The existing global auth store
import { useDemoStore } from '@/store/demoStore';
import { getBackendErrorMessage } from '@/utils/errorHandler';
import type { LoginResponse, LoginResult, User } from '@/types/auth';

export const useAuthFeatureStore = defineStore('authFeature', () => {
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null); // For displaying login errors in the component
  const router = useRouter();
  const rootAuthStore = useRootAuthStore();
  const demoStore = useDemoStore();

  const login = async (email: string, password: string): Promise<LoginResult> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response: LoginResponse = await loginUserService(email, password);

      // Assuming the response contains token, user object, and optionally signup_id
      // The original Login.vue checks for response.token OR response.access_token
      const token = response.token || response.access_token;

      if (token && response.user) {
        // 1. Store token in localStorage (as the rootAuthStore expects it to be there)
        localStorage.setItem('jwtToken', token);

        // 2. Call the login action of the root auth store
        // The rootAuthStore.login action will set its own user, isAuthenticated, jwtToken, and save user to localStorage.
        await rootAuthStore.login(response.user); 

        // 3. Update demoStore
        if (response.signup_id) {
          demoStore.setSignupId(response.signup_id);
        }
        demoStore.setBasicInfo({ email: response.user.email || email }); // Use email from response if available

        // 4. Handle sessionStorage for email verification flow (as in original component)
        sessionStorage.setItem('verificationSource', 'login');
        sessionStorage.setItem('verifyingEmail', response.user.email || email);

        isLoading.value = false;
        // Navigate to email verification as per original flow
        router.push('/email-verification');
        return { success: true, data: response };
      } else {
        throw new Error('Authentication failed: Invalid response from server (missing token or user data).');
      }
    } catch (err: any) {
      console.error('Error in authFeatureStore login:', err);
      error.value = getBackendErrorMessage(err, 'Login failed. Please check your credentials.');
      isLoading.value = false;
      // Clear any potentially partially set token if error occurs after token storage but before full login
      localStorage.removeItem('jwtToken'); 
      return { success: false, error: error.value };
    }
  };

  // Add a logout action that calls the root store's logout
  const logout = (): void => {
    rootAuthStore.logout();
    // Potentially clear any feature-specific state if needed
    // router.push('/login'); // Consider if navigation should be here or in component
  };

  return {
    isLoading,
    error,
    login,
    logout,
    // Expose any other state/getters needed by the login component or other auth features
    isAuthenticated: computed(() => rootAuthStore.isAuthenticated),
    currentUser: computed((): User | null => rootAuthStore.user),
  };
}); 
