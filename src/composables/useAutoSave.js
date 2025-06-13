import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Simple encryption/decryption for sensitive data
const encryptData = (data, key = 'onboarding-key') => {
  try {
    const jsonString = JSON.stringify(data);
    // Simple XOR encryption (for demo - use proper encryption in production)
    let encrypted = '';
    for (let i = 0; i < jsonString.length; i++) {
      encrypted += String.fromCharCode(
        jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

const decryptData = (encryptedData, key = 'onboarding-key') => {
  try {
    const encrypted = atob(encryptedData);
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(
        encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export function useAutoSave(options = {}) {
  const route = useRoute();
  
  const {
    saveInterval = 2000, // Auto-save every 2 seconds
    storageKey = null,
    encryptSensitiveData = false,
    sensitiveFields = ['ssn', 'passport', 'id_number', 'tax_id', 'banking'],
    enableCrossTabSync = true,
    showSaveIndicator = true,
    maxDrafts = 5,
    compressionEnabled = false
  } = options;

  // State
  const isDirty = ref(false);
  const isSaving = ref(false);
  const lastSaved = ref(null);
  const saveError = ref(null);
  const hasRecoverableData = ref(false);
  const draftCount = ref(0);

  // Auto-save timeout
  let saveTimeout = null;
  let saveIndicatorTimeout = null;

  // Generate storage key
  const getStorageKey = (suffix = '') => {
    const base = storageKey || `draft-${route.path}`;
    return suffix ? `${base}-${suffix}` : base;
  };

  // Check if field contains sensitive data
  const isSensitiveField = (fieldName) => {
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field.toLowerCase())
    );
  };

  // Prepare data for storage
  const prepareDataForStorage = (data) => {
    const timestamp = Date.now();
    const metadata = {
      timestamp,
      route: route.path,
      userAgent: navigator.userAgent.substring(0, 100),
      version: '1.0'
    };

    let processedData = { ...data };

    // Handle sensitive data
    if (encryptSensitiveData && sensitiveFields.length > 0) {
      const sensitiveData = {};
      const regularData = {};

      Object.entries(data).forEach(([key, value]) => {
        if (isSensitiveField(key)) {
          sensitiveData[key] = value;
        } else {
          regularData[key] = value;
        }
      });

      processedData = {
        regular: regularData,
        sensitive: encryptData(sensitiveData),
        _encrypted: true
      };
    }

    return {
      data: processedData,
      metadata,
      _autoSave: true
    };
  };

  // Auto-save function
  const autoSave = (data, immediate = false) => {
    if (!data || Object.keys(data).length === 0) return;

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const performSave = () => {
      try {
        isSaving.value = true;
        saveError.value = null;

        const preparedData = prepareDataForStorage(data);
        const key = getStorageKey();

        // Save main draft
        localStorage.setItem(key, JSON.stringify(preparedData));

        // Manage draft history
        manageDraftHistory(preparedData);

        // Update state
        lastSaved.value = new Date();
        isDirty.value = false;

        // Broadcast to other tabs
        if (enableCrossTabSync) {
          broadcastToOtherTabs('draft-saved', { key, data: preparedData });
        }

      } catch (error) {
        console.error('Auto-save error:', error);
        saveError.value = error.message;
      } finally {
        isSaving.value = false;
      }
    };

    if (immediate) {
      performSave();
    } else {
      // Debounced save
      saveTimeout = setTimeout(performSave, saveInterval);
      isDirty.value = true;
    }
  };

  // Manage draft history
  const manageDraftHistory = (draftData) => {
    try {
      const historyKey = getStorageKey('history');
      const stored = localStorage.getItem(historyKey);
      let history = stored ? JSON.parse(stored) : [];

      // Add current draft to history
      history.unshift({
        ...draftData,
        id: Date.now().toString()
      });

      // Limit history size
      if (history.length > maxDrafts) {
        history = history.slice(0, maxDrafts);
      }

      localStorage.setItem(historyKey, JSON.stringify(history));
      draftCount.value = history.length;

    } catch (error) {
      console.error('Error managing draft history:', error);
    }
  };

  // Load saved data
  const loadSavedData = () => {
    try {
      const key = getStorageKey();
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsedData = JSON.parse(stored);
        const restoredData = restoreDataFromStorage(parsedData);
        
        if (restoredData) {
          hasRecoverableData.value = true;
          lastSaved.value = new Date(parsedData.metadata?.timestamp);
          return restoredData;
        }
      }
      
      hasRecoverableData.value = false;
      return null;
    } catch (error) {
      console.error('Error loading saved data:', error);
      hasRecoverableData.value = false;
      return null;
    }
  };

  // Restore data from storage
  const restoreDataFromStorage = (storedData) => {
    try {
      if (!storedData || !storedData._autoSave) return null;

      let data = storedData.data;

      // Handle encrypted data
      if (data._encrypted) {
        const regularData = data.regular || {};
        const sensitiveData = decryptData(data.sensitive) || {};
        return { ...regularData, ...sensitiveData };
      }

      return data;
    } catch (error) {
      console.error('Error restoring data:', error);
      return null;
    }
  };

  // Clear saved data
  const clearSavedData = () => {
    try {
      const key = getStorageKey();
      const historyKey = getStorageKey('history');
      
      localStorage.removeItem(key);
      localStorage.removeItem(historyKey);
      
      hasRecoverableData.value = false;
      isDirty.value = false;
      lastSaved.value = null;
      draftCount.value = 0;

    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  // Cross-tab synchronization
  const broadcastToOtherTabs = (action, payload) => {
    const message = {
      type: 'onboarding-sync',
      action,
      payload,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('cross-tab-message', JSON.stringify(message));
      localStorage.removeItem('cross-tab-message'); // Trigger storage event
    } catch (error) {
      console.error('Error broadcasting to other tabs:', error);
    }
  };

  // Force save (immediate)
  const forceSave = (data) => {
    autoSave(data, true);
  };

  // Setup listeners
  onMounted(() => {
    // Check for existing data
    loadSavedData();
    draftCount.value = getDraftHistory().length;
  });

  onBeforeUnmount(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
  });

  // Get draft history
  const getDraftHistory = () => {
    try {
      const historyKey = getStorageKey('history');
      const stored = localStorage.getItem(historyKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading draft history:', error);
      return [];
    }
  };

  return {
    // State
    isDirty,
    isSaving,
    lastSaved,
    saveError,
    hasRecoverableData,
    draftCount,

    // Methods
    autoSave,
    forceSave,
    loadSavedData,
    clearSavedData,
    getDraftHistory,

    // Utils
    getStorageKey
  };
} 