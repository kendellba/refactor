<template>
  <div class="password-strength-meter mb-4">
    <div class="d-flex align-center">
      <span class="text-caption mr-2">Password strength:</span>
      <div class="strength-bars d-flex">
        <div
          v-for="n in 5"
          :key="n"
          class="strength-bar"
          :class="{
            'strength-bar-filled': strength.overall >= n,
            'strength-bar-weak': strength.overall >= n && strength.overall < 3,
            'strength-bar-medium':
              strength.overall >= n && strength.overall >= 3 && strength.overall < 5,
            'strength-bar-strong': strength.overall >= n && strength.overall === 5,
          }"
        ></div>
      </div>
      <span
        class="text-caption ml-2"
        :class="{
          'text-error': strength.overall < 3,
          'text-warning': strength.overall >= 3 && strength.overall < 5,
          'text-success': strength.overall === 5,
        }"
      >
        {{
          strength.overall === 0
            ? 'Very weak'
            : strength.overall < 3
              ? 'Weak'
              : strength.overall < 5
                ? 'Medium'
                : 'Strong'
        }}
      </span>
    </div>

    <div class="password-criteria d-flex flex-wrap mt-2">
      <div class="criteria-item" :class="{ 'criteria-met': strength.length }">
        <v-icon :color="strength.length ? 'success' : 'grey'" size="small">
          {{ strength.length ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="text-caption">8+ characters</span>
      </div>
      <div class="criteria-item" :class="{ 'criteria-met': strength.lowercase }">
        <v-icon :color="strength.lowercase ? 'success' : 'grey'" size="small">
          {{ strength.lowercase ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="text-caption">lowercase</span>
      </div>
      <div class="criteria-item" :class="{ 'criteria-met': strength.uppercase }">
        <v-icon :color="strength.uppercase ? 'success' : 'grey'" size="small">
          {{ strength.uppercase ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="text-caption">UPPERCASE</span>
      </div>
      <div class="criteria-item" :class="{ 'criteria-met': strength.number }">
        <v-icon :color="strength.number ? 'success' : 'grey'" size="small">
          {{ strength.number ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="text-caption">number</span>
      </div>
      <div class="criteria-item" :class="{ 'criteria-met': strength.special }">
        <v-icon :color="strength.special ? 'success' : 'grey'" size="small">
          {{ strength.special ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="text-caption">special (!@#$)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  strength: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.strength-bars {
  display: flex;
  height: 6px;
  width: 100px;
  gap: 3px;
}

.strength-bar {
  height: 100%;
  width: 20%;
  background-color: #e0e0e0;
  border-radius: 3px;
}

.strength-bar-filled {
  background-color: var(--v-error-base);
}

.strength-bar-weak {
  background-color: var(--v-error-base);
}

.strength-bar-medium {
  background-color: var(--v-warning-base);
}

.strength-bar-strong {
  background-color: var(--v-success-base);
}

.password-criteria {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.criteria-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(0, 0, 0, 0.6);
}

.criteria-met {
  color: var(--v-success-base);
}
</style>
