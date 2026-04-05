import apiClient from './api';

const uploadService = {
  // Upload file via backend API (securely - credentials stay on backend)
  uploadToCloudinary: async (file, folder = 'hravinder') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        url: response.data.data.url,
        publicId: response.data.data.publicId,
        originalName: file.name,
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error.response?.data?.message || error.message}`);
    }
  },

  // Upload document via API
  uploadDocument: (formData) => {
    return apiClient.post('/uploads/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Upload profile picture
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/uploads/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Delete file via backend API
  deleteFromCloudinary: (publicId) => {
    return apiClient.post('/uploads/delete', { publicId });
  },
};

export default uploadService;
