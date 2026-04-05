import apiClient from './api';

const authService = {
  // Register a new user
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    console.log('🔐 Login attempt with:', { email: credentials.email });
    return apiClient.post('/auth/login', credentials)
      .then(response => {
        console.log('✅ Login successful:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ Login failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
        throw error;
      });
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  // Get current user profile
  getProfile: () => {
    return apiClient.get('/auth/profile');
  },

  // Update user profile
  updateProfile: (userData) => {
    return apiClient.put('/auth/profile', userData);
  },

  // Verify email
  verifyEmail: (token) => {
    return apiClient.post('/auth/verify-email', { token });
  },

  // Request password reset
  requestPasswordReset: (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token, password) => {
    return apiClient.post('/auth/reset-password', { token, password });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored auth token
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  // Set auth token
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },
};

export default authService;
