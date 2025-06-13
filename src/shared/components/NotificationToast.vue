<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <v-snackbar
        v-for="notification in notifications"
        :key="notification.id"
        :color="getColor(notification.type)"
        :timeout="0"
        location="top"
        class="notification-toast"
      >
        <div class="d-flex align-center">
          <v-icon
            :icon="getIcon(notification.type)"
            class="me-2"
            size="small"
          />
          <span>{{ notification.message }}</span>
        </div>

        <template v-slot:actions>
          <v-btn
            v-if="notification.action"
            variant="text"
            @click="handleAction(notification)"
          >
            {{ notification.actionText || 'Action' }}
          </v-btn>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="removeNotification(notification.id)"
          />
        </template>
      </v-snackbar>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from 'vue';
import { useNotifications } from '@/shared/composables/useNotifications';
import type { Notification, NotificationType, VuetifyColor } from '@/types';

const { notifications, removeNotification } = useNotifications() as {
  notifications: Ref<Notification[]>;
  removeNotification: (id: string) => void;
};

const getColor = (type: NotificationType): VuetifyColor => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'info';
  }
};

const getIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'mdi-check-circle';
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    default:
      return 'mdi-information';
  }
};

const handleAction = (notification: Notification): void => {
  if (notification.action) {
    notification.action();
  }
  removeNotification(notification.id);
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  padding: 16px;
}

.notification-toast {
  margin-bottom: 8px;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 