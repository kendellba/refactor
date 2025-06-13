# Utilities

This directory contains utility functions used throughout the application.

## File Validation Utility

The `fileValidation.js` utility provides a standardized way to validate file uploads across the application. It helps ensure:

1. File sizes don't exceed maximum limits (20MB by default)
2. Only allowed file types are accepted
3. Required files are provided
4. Consistent error messages are displayed

### Basic Usage

```javascript
import { validateFile, createFileValidationRule } from '@/utils/fileValidation';

// For manual validation in JavaScript
const fileValidationResult = validateFile(myFile, {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  required: true,
  fieldName: 'Document'
});

if (fileValidationResult !== true) {
  formError.value = fileValidationResult;
  return;
}

// For use with Vuetify's rules prop
const validateFileUpload = createFileValidationRule({
  fieldName: 'Proof of address',
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
});

// Then in your template
<v-file-input
  v-model="formData.myFile"
  :rules="[validateFileUpload]"
  ...
/>
```

### Specialized Validators

The utility includes pre-configured validators for common file types:

```javascript
import { validateProofOfAddress, validateIdentificationDocument } from '@/utils/fileValidation';

// Validate proof of address documents
const poaValidation = validateProofOfAddress(formData.proofOfAddressFiles);

// Validate ID documents
const idValidation = validateIdentificationDocument(formData.idFiles, {
  required: false, // Override defaults if needed
});
```

### Configuration Options

All validation functions accept these options:

- **maxSize**: Maximum file size in bytes (default: 20MB)
- **allowedTypes**: Array of allowed MIME types (default: jpeg, png, jpg, pdf)
- **required**: Whether the file is required (default: true)
- **fieldName**: Name of the field for error messages (default: 'Document')

## Address Validation Utility

The `addressValidation.js` utility provides a standardized way to validate address fields across the application. It helps ensure:

1. Address fields meet minimum and maximum length requirements (3-60 characters by default)
2. Required fields are provided
3. Consistent error messages are displayed

### Basic Usage

```javascript
import { validateAddressField, createAddressValidationRule } from '@/utils/addressValidation';

// For manual validation in JavaScript
const addressValidationResult = validateAddressField(formData.addressLine1, {
  minLength: 3,
  maxLength: 60,
  required: true,
  fieldName: 'Address line 1'
});

if (addressValidationResult !== true) {
  fieldErrors.value.addressLine1 = addressValidationResult;
  isValid = false;
}

// For use with Vuetify's rules prop
const addressValidationRule = createAddressValidationRule({
  fieldName: 'Address line 1'
});

// Then in your template
<v-text-field
  v-model="formData.addressLine1"
  :rules="[addressValidationRule]"
  ...
/>
```

### Specialized Validators

The utility includes pre-configured validators for common address fields:

```javascript
import {
  validateAddressLine1,
  validateAddressLine2,
  validateCity,
  addressLine1Rules,
  addressLine2Rules,
  cityRules
} from '@/utils/addressValidation';

// Validate individual fields
const addressLine1Result = validateAddressLine1(formData.addressLine1);

// Or use pre-configured Vuetify rules arrays
<v-text-field
  v-model="formData.addressLine1"
  :rules="addressLine1Rules()"
  ...
/>

<v-text-field
  v-model="formData.addressLine2"
  :rules="addressLine2Rules()"
  ...
/>

<v-text-field
  v-model="formData.city"
  :rules="cityRules()"
  ...
/>
```

### Configuration Options

All validation functions accept these options:

- **minLength**: Minimum field length (default: 3)
- **maxLength**: Maximum field length (default: 60)
- **required**: Whether the field is required (default: true, except for address_line_2)
- **fieldName**: Name of the field for error messages

## User Validation Utility

The `userValidation.js` utility provides a standardized way to validate user-related fields across the application. It helps ensure:

1. Personal information fields are properly validated
2. Password strength requirements are enforced
3. Email and phone number formats are validated
4. Consistent error messages are displayed

### Basic Usage

```javascript
import {
  validateName,
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validatePasswordConfirmation,
} from '@/utils/userValidation';

// Validate user's name
const nameValidation = validateName(formData.firstName, {
  fieldName: 'First name',
});

// Validate email address
const emailValidation = validateEmail(formData.email);

// Validate password (returns an object with validation details)
const passwordValidation = validatePassword(formData.password);
if (!passwordValidation.isValid) {
  fieldErrors.value.password = passwordValidation.message;
}

// Access password strength information
const passwordStrength = passwordValidation.strength;
```

### Specialized Validators

The utility includes validators for all common user-related fields:

```javascript
import {
  validateName,
  validateEmail,
  validateMobileNumber,
  validateDateOfBirth,
  validatePassword,
  validatePasswordConfirmation,
  calculateAge,
} from '@/utils/userValidation';

// Check if user is over 18
const age = calculateAge(new Date(formData.dob));
const isAdult = age >= 18;

// Validate date of birth with minimum age requirement
const dobValidation = validateDateOfBirth(formData.dob, {
  minAge: 18,
});
```

### Configuration Options

Validation functions accept various options:

- **validateName**:

  - **required**: Whether the field is required (default: true)
  - **minLength**: Minimum field length (default: 2)
  - **fieldName**: Name of the field for error messages

- **validateEmail**:

  - **required**: Whether the field is required (default: true)

- **validateMobileNumber**:

  - **required**: Whether the field is required (default: true)

- **validateDateOfBirth**:

  - **required**: Whether the field is required (default: true)
  - **pastOnly**: Whether date must be in the past (default: true)
  - **minAge**: Minimum age in years (default: 0)

- **validatePassword**:
  - **required**: Whether the field is required (default: true)
  - **minLength**: Minimum length (default: 8)
  - **requireLowercase**: Require lowercase letter (default: true)
  - **requireUppercase**: Require uppercase letter (default: true)
  - **requireNumber**: Require number (default: true)
  - **requireSpecial**: Require special character (default: true)

### Debounce Function

The utility also includes a helpful debounce function:

```javascript
import { debounce } from '@/utils/userValidation';

// Create a debounced validation function
const validateNameWithDebounce = debounce(() => {
  const result = validateName(formData.name);
  fieldErrors.value.name = result === true ? '' : result;
}, 300); // 300ms delay
```

## Error Handler Utility

The `errorHandler.js` utility provides standardized error handling across the application.

## Error Messages Utility

The `errorMessages.js` utility contains centralized error messages for consistent messaging across the application.
