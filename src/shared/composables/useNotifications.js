import { ref } from 'vue';

export function useNotifications() {
  const notifications = ref([]);
  const defaultDuration = 5000; // 5 seconds

  const addNotification = ({
    type = 'info',
    message,
    duration = defaultDuration,
    action = null,
    actionText = null,
  }) => {
    const id = Date.now();
    notifications.value.push({
      id,
      type,
      message,
      action,
      actionText,
    });

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options,
    });
  };

  const error = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: options.duration || 8000, // Longer duration for errors
      ...options,
    });
  };

  const warning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options,
    });
  };

  const info = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options,
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
} 