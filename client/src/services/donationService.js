import apiClient from './api';

const donationService = {
  // Get all donation types/categories
  getDonationTypes: () => {
    return apiClient.get('/donations/types');
  },

  // Get specific donation type details
  getDonationType: (typeId) => {
    return apiClient.get(`/donations/types/${typeId}`);
  },

  // Create a new donation
  createDonation: async (donationData) => {
    const response = await apiClient.post('/donations', donationData);
    return response.data.data || response.data;
  },

  // Get user's donations / donation history
  getUserDonations: (filters = {}) => {
    return apiClient.get('/donations', { params: filters });
  },

  // Get donation history (alias for getUserDonations)
  getHistory: async (filters = {}) => {
    const response = await apiClient.get('/donations', { params: filters });
    return response.data.data?.donations || [];
  },

  // Get donation by ID
  getDonation: (donationId) => {
    return apiClient.get(`/donations/${donationId}`);
  },

  // Update donation
  updateDonation: (donationId, data) => {
    return apiClient.put(`/donations/${donationId}`, data);
  },

  // Delete donation
  deleteDonation: (donationId) => {
    return apiClient.delete(`/donations/${donationId}`);
  },

  // Get donation statistics
  getDonationStats: () => {
    return apiClient.get('/donations/statistics');
  },

  // Verify QR payment
  verifyQRPayment: (paymentData) => {
    return apiClient.post('/donations/verify-qr', paymentData);
  },

  // Get all donations for admin
  getAllDonations: (filters = {}) => {
    return apiClient.get('/donations/admin/all', { params: filters });
  },
};

export default donationService;
