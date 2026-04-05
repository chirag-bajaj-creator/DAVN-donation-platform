import { format, formatDistance, parseISO } from 'date-fns';

/**
 * Format utility functions
 */

export const formatters = {
  // Format currency to INR
  formatCurrency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  // Format date to readable format
  formatDate: (date, formatStr = 'MMM dd, yyyy') => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, formatStr);
    } catch {
      return 'Invalid date';
    }
  },

  // Format date to time ago
  formatTimeAgo: (date) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return formatDistance(dateObj, new Date(), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  },

  // Format phone number
  formatPhone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  },

  // Format Aadhar number
  formatAadhar: (aadhar) => {
    const cleaned = aadhar.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return aadhar;
  },

  // Mask Aadhar for display
  maskAadhar: (aadhar) => {
    const cleaned = aadhar.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return cleaned.slice(0, 2) + '*'.repeat(8) + cleaned.slice(-2);
    }
    return aadhar;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    return (value * 100).toFixed(decimals) + '%';
  },

  // Capitalize first letter
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Convert to title case
  toTitleCase: (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
};

/**
 * Parse utility functions
 */
export const parsers = {
  // Parse amount string to number
  parseAmount: (amount) => {
    const num = parseFloat(amount.toString().replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
  },

  // Parse phone number
  parsePhone: (phone) => {
    return phone.replace(/\D/g, '');
  },

  // Parse Aadhar number
  parseAadhar: (aadhar) => {
    return aadhar.replace(/\D/g, '');
  },
};
