# TypeScript Migration Guide

This document outlines the step-by-step migration of the Vue.js onboarding application from JavaScript to TypeScript.

## 🎯 **Migration Strategy**

We're using a **gradual migration approach** to minimize disruption and ensure the app remains functional throughout the process.

### **Phase Overview**
1. ✅ **Setup TypeScript Infrastructure** - TypeScript config, build setup
2. ✅ **Convert Entry Points** - main.ts, vite.config.ts
3. 🔄 **Convert Utilities & Composables** - Simple functions first
4. 🔄 **Convert Components** - Start with leaf components
5. 🔄 **Convert Stores** - Pinia stores with proper typing
6. 🔄 **Convert Complex Components** - Form components, pages
7. 🔄 **Strict Mode** - Enable strict TypeScript checking

## 📁 **Current Status**

### **✅ Completed**
```
✓ tsconfig.json                    # TypeScript configuration
✓ vite.config.ts                   # Vite config converted
✓ src/main.ts                      # Main entry point
✓ src/types/env.d.ts               # Environment types
✓ src/types/index.ts               # Basic type definitions
✓ src/composables/useAutoSave.ts   # Auto-save composable
```

### **🔄 In Progress**
```
- Convert utility functions
- Convert simple composables
- Type existing stores
```

### **⏳ Planned**
```
- Convert Vue components
- Add proper prop types
- Convert route configurations
- Enable strict mode
```

## 🔧 **Configuration Details**

### **TypeScript Config (`tsconfig.json`)**
- **Strict Mode**: Disabled initially for gradual migration
- **Allow JS**: Enabled to coexist with existing JS files
- **Path Mapping**: Configured for `@/*` imports
- **Vue Support**: Proper .vue file handling

### **Build Scripts**
```json
{
  "dev": "vite",                    // Development with TS support
  "build": "vue-tsc && vite build", // Type-check then build
  "build:js": "vite build",         // Build without type checking
  "type-check": "vue-tsc --noEmit", // Type checking only
  "lint": "eslint . --ext .vue,.js,.ts --fix"
}
```

## 📋 **Migration Checklist**

### **Phase 1: Infrastructure & Core Utilities ✅ COMPLETE**

#### **Simple Utilities**
- [x] Convert `src/utils/userValidation.js` → `.ts`
- [ ] Convert `src/utils/formatting.js`
- [x] Convert `src/shared/constants/*.js` → `.ts` (Phase 2)
- [x] Convert `src/features/*/constants/*.js` → `.ts` (Phase 2)

#### **Composables**
- [x] Convert `src/composables/useAutoSave.js` → `.ts`
- [ ] Convert `src/composables/useCompleteOnboardingStepper.js`
- [ ] Convert `src/composables/useEnhancedFormManager.js`

### **Phase 2: Stores**
- [ ] Convert `src/store/authStore.js`
- [ ] Convert `src/store/demoStore.js`
- [ ] Convert `src/features/onboarding/stores/*.js`

### **Phase 3: Components**
- [ ] Convert `src/components/SaveIndicator.vue`
- [ ] Convert `src/components/DataRecoveryDialog.vue`
- [ ] Convert `src/components/ui/*.vue`

### **Phase 4: Complex Components**
- [ ] Convert form components
- [ ] Convert page components
- [ ] Convert router configuration

## 🛠️ **Conversion Guidelines**

### **File Naming Convention**
```
✓ .js → .ts     (for TypeScript files)
✓ .vue stays    (Vue components with <script setup lang="ts">)
```

### **Type Definitions**
```typescript
// Use interfaces for objects
interface User {
  id: string;
  name: string;
  email?: string; // Optional properties
}

// Use type aliases for unions
type Status = 'pending' | 'success' | 'error';

// Use generics for reusable types
interface ApiResponse<T> {
  data: T;
  success: boolean;
}
```

### **Vue Components**
```vue
<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';

// Define props with types
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

// Define emits with types
interface Emits {
  (e: 'update', value: string): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// Typed refs
const isLoading: Ref<boolean> = ref(false);
const user: Ref<User | null> = ref(null);
</script>
```

### **Composables**
```typescript
import { ref, type Ref } from 'vue';

interface Options {
  initialValue?: string;
  autoSave?: boolean;
}

export function useMyComposable(options: Options = {}) {
  const value: Ref<string> = ref(options.initialValue || '');
  
  const updateValue = (newValue: string): void => {
    value.value = newValue;
  };

  return {
    value,
    updateValue
  };
}
```

## 🚨 **Migration Rules**

### **Do's**
- ✅ Start with simple files (utilities, constants)
- ✅ Use `any` temporarily for complex types
- ✅ Add `// @ts-ignore` for temporary type issues
- ✅ Keep existing functionality working
- ✅ Test after each conversion

### **Don'ts**
- ❌ Don't enable strict mode immediately
- ❌ Don't convert everything at once
- ❌ Don't break existing functionality
- ❌ Don't over-type initially (use `any` when needed)

## 🧪 **Testing Strategy**

### **After Each Conversion**
1. Run `npm run type-check` - Ensure no TypeScript errors
2. Run `npm run build:js` - Ensure build works
3. Run `npm run dev` - Test in development
4. Manual testing of converted functionality

### **Type Coverage**
- Start with basic types
- Gradually add more specific types
- Use TypeScript playground for complex types

## 📊 **Progress Tracking**

### **Migration Metrics**
- **Files Converted**: 16/200+ (~8%)
- **Type Coverage**: Infrastructure + Constants + Core Utils
- **Build Status**: ✅ Working
- **Breaking Changes**: None

### **Completed Phases**
1. ✅ Phase 1: Infrastructure & Core Utilities
2. ✅ Phase 2: Constants Conversion

### **Next Steps**
1. Convert UI components (`src/components/`)
2. Convert form components
3. Convert remaining composables
4. Begin store conversion

## 🔗 **Resources**

### **TypeScript + Vue 3**
- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Vue 3 Script Setup](https://vuejs.org/api/sfc-script-setup.html)
- [Pinia TypeScript](https://pinia.vuejs.org/typescript.html)

### **Migration Tools**
- `vue-tsc` - TypeScript checker for Vue
- TypeScript playground for testing types
- Vue Language Features (Volar) VS Code extension

## 🎯 **Success Criteria**

### **Phase 1 Complete When:**
- ✅ All utility functions converted
- ✅ All constants typed
- ✅ Basic composables converted
- ✅ No TypeScript errors in converted files

### **Final Success:**
- 100% TypeScript coverage
- Strict mode enabled
- Full type safety
- No `any` types except where necessary
- Comprehensive type definitions

---

## 🚀 **Current Status: Phase 3 - Batch 2 Complete**

Both Phase 1 (Infrastructure & Core Utilities) and Phase 2 (Constants Conversion) are complete, and we've now finished 2 batches of Phase 3 component conversions!

**Recently Completed**: 
- Batch 1: UI components (SaveIndicator, DataRecoveryDialog, SimpleStepper, AppStepper)
- Batch 2: Page & Feature components (Dashboard, Login, Success, PersistenceDemo)

**Achievements**:
- 8 components converted to TypeScript with proper typing
- Form integration patterns established
- Complex composable typing resolved
- Vuetify component typing implemented

**Next Priority**: Begin Batch 3 - Additional form components and layout components 