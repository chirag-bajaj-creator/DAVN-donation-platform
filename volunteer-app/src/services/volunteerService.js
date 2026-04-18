import apiClient, { SOCKET_PATH, SOCKET_TRANSPORTS, SOCKET_URL } from './api';
import { io } from 'socket.io-client';

let volunteerSocket;

export const getVolunteerSocket = () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return null;
  }

  if (!volunteerSocket) {
    volunteerSocket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      auth: {
        token: `Bearer ${token}`
      },
      transports: SOCKET_TRANSPORTS,
      upgrade: false
    });
  } else if (!volunteerSocket.connected) {
    volunteerSocket.auth = {
      token: `Bearer ${token}`
    };
    volunteerSocket.connect();
  }

  return volunteerSocket;
};

export const disconnectVolunteerSocket = () => {
  if (!volunteerSocket) {
    return;
  }

  volunteerSocket.disconnect();
  volunteerSocket = null;
};

const volunteerService = {
  // Get current volunteer profile
  getMe: () => {
    return apiClient.get('/volunteers/me');
  },

  // Get all volunteers (admin only)
  getAll: (filters = {}) => {
    return apiClient.get('/volunteers', { params: filters });
  },

  // Register as specialized volunteer.
  // The current backend route accepts JSON and does not parse multipart form data.
  registerSpecialized: (userData) => {
    return apiClient.post('/volunteers/register/specialized', {
      specialization: userData.specialization,
      experience: userData.experience,
      documents: userData.documents || [],
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
  submitReport: (caseId, reportData, needyType) => {
    return apiClient.post(`/volunteers/cases/${caseId}/report`, reportData, {
      params: needyType ? { needyType } : undefined,
    });
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
