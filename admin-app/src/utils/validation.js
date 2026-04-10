/**
 * Validation utility functions
 */

export const validators = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (min 8 chars, 1 uppercase, 1 number, 1 special char)
  isValidPassword: (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  },

  // Phone number validation
  isValidPhone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  // Aadhar validation
  isValidAadhar: (aadhar) => {
    return /^[0-9]{12}$/.test(aadhar);
  },

  // PAN validation
  isValidPAN: (pan) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  },

  // URL validation
  isValidURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Amount validation (positive number)
  isValidAmount: (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  },
};

/**
 * Custom validation rules for react-hook-form
 */
export const validationRules = {
  email: {
    required: 'Email is required',
    validate: (value) => validators.isValidEmail(value) || 'Invalid email format',
  },

  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    validate: (value) =>
      validators.isValidPassword(value) ||
      'Password must contain uppercase, number, and special character',
  },

  confirmPassword: (getValues) => ({
    required: 'Please confirm password',
    validate: (value) =>
      value === getValues('password') || 'Passwords do not match',
  }),

  phone: {
    required: 'Phone number is required',
    validate: (value) => validators.isValidPhone(value) || 'Invalid phone number',
  },

  aadhar: {
    required: 'Aadhar number is required',
    validate: (value) => validators.isValidAadhar(value) || 'Aadhar must be 12 digits',
  },

  pan: {
    required: 'PAN is required',
    validate: (value) => validators.isValidPAN(value) || 'Invalid PAN format',
  },

  amount: {
    required: 'Amount is required',
    validate: (value) => validators.isValidAmount(value) || 'Amount must be a positive number',
  },

  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
  },

  url: {
    validate: (value) =>
      !value || validators.isValidURL(value) || 'Invalid URL format',
  },
};

/**
 * Helper validation functions for forms
 */
export const validateEmail = (email) => {
  return validators.isValidEmail(email) ? true : 'Invalid email format';
};

export const validatePassword = (password) => {
  return validators.isValidPassword(password)
    ? true
    : 'Password must contain uppercase, number, and special character';
};

export const validatePhone = (phone) => {
  return validators.isValidPhone(phone) ? true : 'Invalid phone number';
};

export const validateAmount = (amount) => {
  return validators.isValidAmount(amount)
    ? true
    : 'Amount must be a positive number';
};
