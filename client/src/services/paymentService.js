import api from './api';

const paymentService = {
  async createPayment(donationId, amount) {
    const response = await api.post('/payments', { donationId, amount });
    return response.data;
  },

  async getPaymentDetails(orderId) {
    const response = await api.get(`/payments/${orderId}`);
    return response.data;
  },

  async checkStatus(orderId) {
    const response = await api.get(`/payments/${orderId}/status`);
    return response.data;
  },

  async verifyPayment(orderId, paymentDetails) {
    const response = await api.post(`/payments/${orderId}/verify`, paymentDetails);
    return response.data;
  },

  async getPaymentHistory() {
    const response = await api.get('/payments/history');
    return response.data;
  },
};

export default paymentService;
