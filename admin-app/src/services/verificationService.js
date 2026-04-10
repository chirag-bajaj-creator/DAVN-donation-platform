import api from './api';

const verificationService = {
  async getPendingVerifications() {
    const response = await api.get('/admin/verifications/pending');
    return response.data;
  },

  async getVerificationDetails(needyId) {
    const response = await api.get(`/admin/verifications/${needyId}`);
    return response.data;
  },

  async submitVerification(needyId, verification) {
    const response = await api.post(`/admin/verifications/${needyId}`, verification);
    return response.data;
  },

  async getVerificationHistory() {
    const response = await api.get('/admin/verifications/history');
    return response.data;
  },

  async approveNeedy(needyId) {
    const response = await api.post(`/admin/verifications/${needyId}/approve`);
    return response.data;
  },

  async rejectNeedy(needyId, reason) {
    const response = await api.post(`/admin/verifications/${needyId}/reject`, { reason });
    return response.data;
  },
};

export default verificationService;
