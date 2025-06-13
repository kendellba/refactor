<template>
  <v-app>
    <!-- Responsive Layout - Show sidebar on desktop, hide on mobile -->
    <v-navigation-drawer
      permanent
      color="white"
      width="190"
      border
      :class="{ 'mobile-hidden': isMobile }"
    >
      <!-- App Logo -->
      <div class="pa-4">
        <v-img
          src="@/assets/Logo1.png"
          alt="Cathedral Engage"
          width="140"
          class="mt-2 mb-4"
          contain
        />
      </div>

      <!-- Navigation Menu -->
      <v-list nav class="mt-4">
        <v-list-item
          prepend-icon="mdi-bank"
          title="Accounts"
          value="accounts"
          :active="currentSection === 'accounts'"
          class="mb-2"
          @click="currentSection = 'accounts'"
        />

        <v-list-item
          prepend-icon="mdi-file-document"
          title="Applications"
          value="applications"
          :active="currentSection === 'applications'"
          class="mb-2"
          @click="currentSection = 'applications'"
        />

        <v-list-item
          prepend-icon="mdi-bank-transfer"
          title="Transfers"
          value="transfers"
          :active="currentSection === 'transfers'"
          class="mb-2"
          color="primary"
          @click="currentSection = 'transfers'"
        />

        <v-list-item
          prepend-icon="mdi-clipboard-text"
          title="Requests"
          value="requests"
          :active="currentSection === 'requests'"
          class="mb-2"
          @click="currentSection = 'requests'"
        />
      </v-list>

      <!-- Bottom of Sidebar - Brand Info -->
      <template #append>
        <div class="px-4 py-2 d-flex align-center">
          <v-avatar size="36" color="grey-lighten-3" class="mr-2">
            <v-img src="@/assets/Logo1.png" alt="Cathedral" />
          </v-avatar>
          <div class="text-caption">
            <div class="font-weight-medium">Cathedral Credit Union</div>
            <div class="text-caption text-grey">Licensed by NCUA</div>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main :class="{ 'mobile-view': isMobile, 'bg-grey-lighten-4': !isMobile }">
      <!-- Mobile Header with User Profile -->
      <div v-if="isMobile" class="mobile-header">
        <div class="mobile-notifications">
          <v-badge dot color="red" class="mr-2">
            <v-btn icon>
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </v-badge>
        </div>

        <div class="mobile-menu">
          <v-btn icon @click="mobileMenuOpen = true">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Mobile Menu Drawer -->
      <v-navigation-drawer v-model="mobileMenuOpen" location="right" temporary width="280">
        <v-list>
          <v-list-item>
            <template #prepend>
              <v-avatar>
                <v-img
                  src="https://randomuser.me/api/portraits/women/17.jpg"
                  alt="User Profile"
                ></v-img>
              </v-avatar>
            </template>
            <v-list-item-title>Maria User</v-list-item-title>
            <v-list-item-subtitle>maria@cathedral.com</v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item
            prepend-icon="mdi-account-outline"
            title="Profile Settings"
            link
          ></v-list-item>

          <v-list-item link>
            <template #prepend>
              <v-icon>{{
                isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'
              }}</v-icon>
            </template>
            <v-list-item-title>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</v-list-item-title>
            <template #append>
              <v-switch
                v-model="isDarkMode"
                color="primary"
                hide-details
                density="compact"
                @change="toggleDarkMode"
              ></v-switch>
            </template>
          </v-list-item>

          <v-list-item prepend-icon="mdi-cog-outline" title="Account Settings" link></v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item
            prepend-icon="mdi-help-circle-outline"
            title="Help & Support"
            link
          ></v-list-item>
          <v-list-item prepend-icon="mdi-information-outline" title="About" link></v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item prepend-icon="mdi-logout" title="Logout" link @click="logout"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Mobile Profile Section -->
      <div v-if="isMobile" class="mobile-profile pa-4 text-center">
        <v-avatar size="100" class="mb-2 profile-avatar">
          <v-img src="https://randomuser.me/api/portraits/women/17.jpg" alt="User Profile"></v-img>
        </v-avatar>
        <div class="text-h6 primary--text">Hi Maria</div>
        <div class="text-subtitle-2 text-grey">Welcome back</div>
      </div>

      <!-- Mobile Navigation Tabs -->
      <div v-if="isMobile" class="px-4 mb-4">
        <v-card variant="flat" class="rounded-lg">
          <v-tabs
            v-model="currentSection"
            slider-color="primary"
            density="comfortable"
            color="primary"
          >
            <v-tab value="accounts">Accounts</v-tab>
            <v-tab value="transfers">Transfers</v-tab>
            <v-tab value="applications">Applications</v-tab>
            <v-tab value="requests">Requests</v-tab>
          </v-tabs>
        </v-card>
      </div>

      <!-- Top App Bar - Only show on desktop -->
      <v-app-bar v-if="!isMobile" color="white" elevation="0" border>
        <v-app-bar-title>{{ getHeaderTitle }}</v-app-bar-title>
        <v-spacer></v-spacer>

        <!-- User Actions Menu -->
        <v-btn icon class="mr-2">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn icon class="mr-2">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-btn icon class="mr-2">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Main Content -->
      <v-container
        :fluid="!isMobile"
        :class="{ 'pa-0': !isMobile, 'px-4': isMobile }"
        class="fill-height"
      >
        <!-- Dynamic Content based on current section -->
        <component :is="currentComponent" :is-mobile="isMobile" @navigate="handleNavigation" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type Ref, type ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from 'vuetify';
import { useMobile } from '@/composables/useMobile';

// Import dashboard components
import DashboardAccounts from './DashboardAccounts.vue';
import TransferIndex from './DashboardTransfers/TransferIndex.vue';
import DashboardApplications from './DashboardApplications.vue';
import DashboardRequests from './DashboardRequests.vue';

interface Props {
  initialTab?: string;
}

interface TabItem {
  title: string;
  value: string;
  icon: string;
  component: string;
}

withDefaults(defineProps<Props>(), {
  initialTab: 'accounts',
});

const router = useRouter();
const authStore = useAuthStore();
const theme = useTheme();
const isMobile: Ref<boolean> = ref(false);

const currentSection = ref('accounts'); // Default to accounts view
const mobileMenuOpen = ref(false);
const isDarkMode = ref(theme.global.current.value.dark);
const isLoading = ref(false);

const dashboardTabs: TabItem[] = [
  {
    title: 'Accounts',
    value: 'accounts',
    icon: 'mdi-bank',
    component: 'DashboardAccounts'
  },
  {
    title: 'Transfers',
    value: 'transfers', 
    icon: 'mdi-swap-horizontal',
    component: 'TransferIndex'
  },
  {
    title: 'Bills',
    value: 'bills',
    icon: 'mdi-receipt',
    component: 'BillsIndex'
  },
  {
    title: 'Settings',
    value: 'settings',
    icon: 'mdi-cog',
    component: 'SettingsIndex'
  }
];

const currentComponent: ComputedRef<string> = computed(() => {
  const tab = dashboardTabs.find(t => t.value === currentSection.value);
  return tab?.component || 'DashboardAccounts';
});

// Dynamic header title based on current section
const getHeaderTitle = computed(() => {
  const tab = dashboardTabs.find(t => t.value === currentSection.value);
  return tab?.title.toUpperCase() || 'CATHEDRAL ENGAGE';
});

// Handle navigation events from child components
const handleNavigation = (section: string): void => {
  currentSection.value = section;
  // Update URL if needed
  router.push({ query: { tab: section } });
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

// Handle window resize for mobile detection
const handleResize = (): void => {
  isMobile.value = window.innerWidth < 768;
};

// Toggle dark mode
const toggleDarkMode = () => {
  theme.global.name.value = isDarkMode.value ? 'dark' : 'light';
};

// Watch for theme changes from outside this component
watch(
  () => theme.global.current.value.dark,
  (newDarkMode) => {
    isDarkMode.value = newDarkMode;
  }
);

const refreshData = async (): Promise<void> => {
  isLoading.value = true;
  try {
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Development flag - ALWAYS TRUE for development
  const isDevelopment = true;

  // Check mobile on mount and add resize listener
  handleResize();
  window.addEventListener('resize', handleResize);

  // Skip authentication check in development mode
  if (!isDevelopment && !authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  // Force mock data for development regardless of authentication state
  if (isDevelopment) {
    // Mock user data for development
    (authStore as any).$patch$patch({
      user: {
        first_name: 'Maria',
        last_name: 'User',
        middle_name: 'Dev',
        email: 'maria@cathedral.com',
        mobile: '+1 555-123-4567',
        nationality: 'United States',
        verified: true,
        address: {
          address_line_1: '123 Demo Street',
          city: 'Demo City',
          country: 'United States',
        },
      },
      isAuthenticated: true,
    });
  }

  // Initialize dashboard
  const queryTab = router.currentRoute.value.query.tab as string;
  if (queryTab && dashboardTabs.some(tab => tab.value === queryTab)) {
    currentSection.value = queryTab;
  }
});

// Clean up event listeners on unmount
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.mobile-hidden {
  display: none !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .v-navigation-drawer {
    display: none !important;
  }

  .v-main {
    padding-left: 0 !important;
  }
}

.mobile-view {
  background-color: #f8f9fa;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

.mobile-profile {
  margin-bottom: 20px;
}

.profile-avatar {
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-drawer-header {
  background-color: var(--v-primary-lighten1);
  color: white;
}

.mobile-drawer-avatar {
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-drawer-item {
  border-radius: 8px;
  margin: 4px 8px;
}

.mobile-drawer-item:hover {
  background-color: rgba(92, 107, 192, 0.1);
}
</style>
