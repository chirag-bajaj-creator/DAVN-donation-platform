import apiClient from './api';

const volunteerService = {
  // Get current volunteer profile
  getMe: () => {
    return apiClient.get('/volunteers/me');
  },

  // Get all volunteers (admin only)
  getAll: (filters = {}) => {
    return apiClient.get('/volunteers', { params: filters });
  },

  // Register as specialized volunteer with documents
  registerSpecialized: (userData) => {
    const formData = new FormData();

    // Add basic fields
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);
    formData.append('password', userData.password);
    formData.append('specialization', userData.specialization);
    formData.append('experience', userData.experience);

    // Add document if provided
    if (userData.certificationDocument) {
      formData.append('certificationDocument', userData.certificationDocument);
    }

    return apiClient.post('/volunteers/register/specialized', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Register as unspecialized volunteer
  registerUnspecialized: (userData) => {
    return apiClient.post('/volunteers/register/unspecialized', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      availability: userData.availability,
    });
  },

  // Get assigned tasks/cases
  getAssignedCases: () => {
    return apiClient.get('/volunteers/cases');
  },

  // Submit verification report for a case
  submitReport: (caseId, reportData) => {
    return apiClient.post(`/volunteers/cases/${caseId}/report`, reportData);
  },

  // Get available needy cases
  getAvailableCases: (filters = {}) => {
    return apiClient.get('/volunteers/available-cases', { params: filters });
  },

  // Accept a case
  acceptCase: (caseId) => {
    return apiClient.post(`/volunteers/cases/${caseId}/accept`);
  },

  // Reject a case
  rejectCase: (caseId) => {
    return apiClient.post(`/volunteers/cases/${caseId}/reject`);
  },
};

export default volunteerService;
