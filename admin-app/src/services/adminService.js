import { io } from 'socket.io-client';
import { API_BASE, SOCKET_URL } from './api';

let adminSocket;

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
});

export const getAdminSocket = () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return null;
  }

  if (!adminSocket) {
    adminSocket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket', 'polling']
    });
  } else if (!adminSocket.connected) {
    adminSocket.auth = {
      token: `Bearer ${token}`
    };
    adminSocket.connect();
  }

  return adminSocket;
};

export const disconnectAdminSocket = () => {
  if (!adminSocket) {
    return;
  }

  adminSocket.disconnect();
  adminSocket = null;
};

export const adminService = {
  getStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  getDonations: async (limit = 50, skip = 0, status = null) => {
    let url = `${API_BASE}/admin/donations?limit=${limit}&skip=${skip}`;
    if (status) url += `&status=${status}`;
    const res = await fetch(url, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch donations');
    return res.json();
  },

  getUsers: async (limit = 50, skip = 0, role = null) => {
    let url = `${API_BASE}/admin/users?limit=${limit}&skip=${skip}`;
    if (role) url += `&role=${role}`;
    const res = await fetch(url, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  updateUserRole: async (userId, role) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
  },

  getVolunteers: async (page = 1, limit = 10, status = null) => {
    let url = `${API_BASE}/admin/volunteers?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const res = await fetch(url, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch volunteers');
    return res.json();
  },

  approveVolunteer: async (volunteerId) => {
    const res = await fetch(`${API_BASE}/admin/volunteers/${volunteerId}/approve`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to approve volunteer');
    return res.json();
  },

  rejectVolunteer: async (volunteerId, reason) => {
    const res = await fetch(`${API_BASE}/admin/volunteers/${volunteerId}/reject`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to reject volunteer');
    return res.json();
  },

  getPendingNeedy: async (page = 1, limit = 10) => {
    const res = await fetch(`${API_BASE}/admin/needy/pending?page=${page}&limit=${limit}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch pending needy');
    return res.json();
  },

  assignVolunteerToNeedy: async (needyId, volunteerId) => {
    const res = await fetch(`${API_BASE}/admin/needy/${needyId}/assign`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Failed to assign volunteer');
    return data;
  },

  getVerificationReports: async (limit = 20, skip = 0) => {
    const res = await fetch(`${API_BASE}/admin/verification-reports?limit=${limit}&skip=${skip}`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch verification reports');
    return data;
  },

  downloadVerificationReportPdf: async (reportId) => {
    const res = await fetch(`${API_BASE}/admin/verification-reports/${reportId}/pdf`, {
      headers: getAuthHeader()
    });

    if (!res.ok) {
      let errorMessage = 'Failed to download verification report PDF';
      try {
        const data = await res.json();
        errorMessage = data.error || data.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return res.blob();
  }
};
