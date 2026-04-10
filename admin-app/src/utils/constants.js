/**
 * Application constants
 */

export const DONATION_TYPES = {
  MONEY: 'money',
  FOOD: 'food',
  CLOTHES: 'clothes',
  BOOKS: 'books',
  MEDICAL: 'medical',
  SUPPLIES: 'supplies',
};

export const DONATION_TYPE_LABELS = {
  [DONATION_TYPES.MONEY]: 'Money Donation',
  [DONATION_TYPES.FOOD]: 'Food Donation',
  [DONATION_TYPES.CLOTHES]: 'Clothes Donation',
  [DONATION_TYPES.BOOKS]: 'Books Donation',
  [DONATION_TYPES.MEDICAL]: 'Medical Donation',
  [DONATION_TYPES.SUPPLIES]: 'Supplies Donation',
};

export const NEEDY_CATEGORIES = {
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
  ELDERLY: 'elderly',
  CHILDREN: 'children',
  DISABLED: 'disabled',
  ORPHANAGE: 'orphanage',
  MEDICAL: 'medical',
  EDUCATION: 'education',
};

export const NEEDY_VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

export const USER_ROLES = {
  DONOR: 'donor',
  NEEDY: 'needy',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  CASH: 'cash',
  WALLET: 'wallet',
};

export const DONATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DISTRIBUTED: 'distributed',
  CANCELLED: 'cancelled',
};

export const SORTING_OPTIONS = {
  RECENT: 'recent',
  AMOUNT_HIGH_TO_LOW: 'amount_high_to_low',
  AMOUNT_LOW_TO_HIGH: 'amount_low_to_high',
  RATING: 'rating',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const DATE_FORMATS = {
  SHORT_DATE: 'MMM dd, yyyy',
  LONG_DATE: 'EEEE, MMMM dd, yyyy',
  TIME: 'hh:mm a',
  DATE_TIME: 'MMM dd, yyyy hh:mm a',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  REGISTRATION_SUCCESS: 'Registration successful. Please check your email.',
  UPDATE_SUCCESS: 'Updated successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  CREATION_SUCCESS: 'Created successfully.',
};

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  ALLOWED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png'],
};

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  AADHAR: /^[0-9]{12}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};
