# Form Validation Guidelines

## Standardized Error Display

Our application uses a standardized approach to display form field errors across all components. This ensures a consistent user experience and makes validation errors more visible and readable.

## How to Implement Enhanced Error Display

### 1. Using the FormFieldError Component

The simplest way to implement enhanced error styling is to use the `FormFieldError` component:

```vue
<template>
  <v-text-field
    v-model="email"
    label="Email"
    :error-messages="undefined"
    :error="!!emailError"
    :append-inner-icon="emailError ? 'mdi-alert-circle' : undefined"
    @input="validateEmail"
  >
    <template v-if="emailError" #details>
      <FormFieldError :error-message="emailError" />
    </template>
  </v-text-field>
</template>

<script setup>
import FormFieldError from '@/components/ui/FormFieldError.vue';
</script>
```

### 2. Direct Implementation

If you prefer not to use the component, implement the error styling directly:

```vue
<v-text-field
  v-model="fieldValue"
  label="Field Label"
  :error-messages="undefined" <!-- Important: Set to undefined to avoid duplicate error messages -->
  :error="!!fieldError"
  :append-inner-icon="fieldError ? 'mdi-alert-circle' : undefined"
  @input="validateField"
>
  <template v-if="fieldError" #details>
    <div class="custom-error-container">
      <v-icon size="small" color="error" class="mr-1">
        mdi-alert-circle
      </v-icon>
      <span>{{ fieldError }}</span>
    </div>
  </template>
</v-text-field>
```

## Key Components

1. **Set :error-messages to undefined**

   - This prevents duplicate error messages

2. **Set :error attribute**

   - Use `!!errorVar` to convert the error message to a boolean

3. **Add an alert icon when there's an error**

   - `:append-inner-icon="errorVar ? 'mdi-alert-circle' : undefined"`

4. **Use the #details slot**

   - This is where the custom error display is added

5. **Use the custom-error-container style**
   - Provides consistent styling across all form fields

## Best Practices

1. **Avoid Error Message Duplication**

   - Always set `:error-messages="undefined"` when using custom error display

2. **Validate on Input and Blur**

   - Add validation on both input and blur events for the best UX

3. **Use Icon Indicators**

   - Show alert icons to visually indicate errors

4. **Clear and Specific Error Messages**

   - Error messages should be clear and specifically describe the issue

5. **Consistent Styling**
   - Use the global error styling for all form components

## Global CSS Classes

The following CSS classes are available in `global.css` for error styling:

- `custom-error-container`: The main container for error messages
- `v-field--error`: Styling for fields with errors
- `v-input__details`: Styling for error details section
- `v-messages__message`: Styling for error messages

## Examples

### Basic Field with Error

```vue
<v-text-field
  v-model="firstName"
  :error-messages="undefined"
  :error="!!firstNameError"
  :append-inner-icon="firstNameError ? 'mdi-alert-circle' : undefined"
>
  <template v-if="firstNameError" #details>
    <FormFieldError :error-message="firstNameError" />
  </template>
</v-text-field>
```

### Select Field with Error

```vue
<v-select
  v-model="country"
  :items="countries"
  :error-messages="undefined"
  :error="!!countryError"
  :append-inner-icon="countryError ? 'mdi-alert-circle' : undefined"
>
  <template v-if="countryError" #details>
    <FormFieldError :error-message="countryError" />
  </template>
</v-select>
```

By following these guidelines, we ensure a consistent error display across all form fields in the application.
