import apiClient from './api';

const needyService = {
  // Register as needy (individual)
  registerIndividual: (formData) => {
    console.log('API: Sending individual registration:', formData);
    return apiClient.post('/needy/individuals', formData);
  },

  // Register as needy (organization)
  registerOrganization: (formData) => {
    console.log('API: Sending organization registration:', formData);
    return apiClient.post('/needy/organizations', formData);
  },

  // Get needy profile
  getNeedyProfile: () => {
    return apiClient.get('/needy/profile');
  },

  // Update needy profile
  updateNeedyProfile: (needyId, data) => {
    return apiClient.put(`/needy/${needyId}`, data);
  },

  // Get verified needy list
  getVerifiedNeedy: (filters = {}) => {
    return apiClient.get('/needy/verified', { params: filters });
  },

  // Get specific needy details
  getNeedyDetails: (needyId) => {
    return apiClient.get(`/needy/${needyId}`);
  },

  // Get needy by category
  getNeedyByCategory: (category, filters = {}) => {
    return apiClient.get(`/needy/category/${category}`, { params: filters });
  },

  // Get pending verification list (admin only)
  getPendingNeedy: (filters = {}) => {
    return apiClient.get('/needy/admin/pending', { params: filters });
  },

  // Approve needy (admin only)
  approveNeedy: (needyId, remarks) => {
    return apiClient.post(`/needy/${needyId}/approve`, { remarks });
  },

  // Reject needy (admin only)
  rejectNeedy: (needyId, remarks) => {
    return apiClient.post(`/needy/${needyId}/reject`, { remarks });
  },

  // Get needy statistics
  getNeedyStats: () => {
    return apiClient.get('/needy/statistics');
  },
};

export default needyService;
