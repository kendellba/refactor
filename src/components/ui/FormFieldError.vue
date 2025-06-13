<template>
  <div v-if="errorMessage" class="custom-error-container">
    <v-icon size="small" color="error" class="mr-1"> mdi-alert-circle </v-icon>
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
export default {
  name: 'FormFieldError',
  props: {
    errorMessage: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
/* No need for additional styles as they are defined in global.css */
</style>
