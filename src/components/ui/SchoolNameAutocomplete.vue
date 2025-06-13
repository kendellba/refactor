<template>
  <div class="school-name-autocomplete">
    <v-text-field
      v-model="inputValue"
      :label="label"
      :placeholder="placeholder"
      variant="outlined"
      density="comfortable"
      bg-color="grey-lighten-5"
      prepend-inner-icon="mdi-school"
      required
      :error-messages="errorMessage"
      @input="handleInput"
      @blur="handleBlur"
      @focus="filterSchools(inputValue)"
    />
    <!-- School autocomplete dropdown -->
    <div v-if="isDropdownOpen && filteredSchools.length > 0" class="school-autocomplete-container">
      <v-list density="compact" class="school-suggestions-list" elevation="3">
        <v-list-item
          v-for="(school, index) in filteredSchools"
          :key="index"
          :value="school"
          class="school-suggestion-item"
          @click="selectSchool(school)"
        >
          {{ school }}
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import schoolsList from '@/assets/data/schools.json';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  required?: boolean;
}

interface Emits {
  'update:modelValue': [value: string];
  'validate': [];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'School Name',
  placeholder: 'Enter your school name',
  errorMessage: '',
  required: true,
});

const emit = defineEmits<Emits>();

const inputValue: Ref<string> = ref(props.modelValue);
const filteredSchools: Ref<string[]> = ref([]);
const isDropdownOpen: Ref<boolean> = ref(false);

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue: string) => {
    inputValue.value = newValue;
  }
);

// Watch for internal input changes
watch(inputValue, (newValue: string) => {
  emit('update:modelValue', newValue);
});

const handleInput = (): void => {
  console.log('Input value changed to:', inputValue.value);

  // Ensure we're always emitting a valid string
  const valueToEmit = inputValue.value || '';
  emit('update:modelValue', valueToEmit);

  // Filter suggestions based on input
  filterSchools(valueToEmit);

  // Trigger validation
  emit('validate');
};

const handleBlur = (): void => {
  window.setTimeout(() => {
    isDropdownOpen.value = false;
  }, 200);
};

const filterSchools = (input: string): void => {
  if (!input || input.length < 2) {
    filteredSchools.value = [];
    return;
  }

  const searchTerm = input.toLowerCase();
  filteredSchools.value = (schoolsList as string[])
    .filter((school: string) => school.toLowerCase().includes(searchTerm))
    .slice(0, 10); // Limit to 10 results for performance

  // Only show dropdown if we have results
  isDropdownOpen.value = filteredSchools.value.length > 0;
};

const selectSchool = (school: string): void => {
  console.log('Selecting school:', school);
  inputValue.value = school;
  emit('update:modelValue', school);
  isDropdownOpen.value = false;
  filteredSchools.value = [];
  emit('validate');
};
</script>

<style scoped>
.school-name-autocomplete {
  position: relative;
  margin-bottom: 28px; /* Add space for dropdown */
}

.school-autocomplete-container {
  position: absolute;
  width: 100%;
  z-index: 10;
  max-height: 250px;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-top: -20px; /* Position right below the input */
  left: 0;
  right: 0;
}

.school-suggestions-list {
  border-radius: 12px;
  overflow: hidden;
}

.school-suggestion-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.school-suggestion-item:hover {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
