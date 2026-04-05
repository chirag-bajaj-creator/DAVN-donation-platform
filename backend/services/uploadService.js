const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadService = {
  /**
   * Upload file to Cloudinary
   */
  uploadFile: async (filePath, folder = 'hravinder/general') => {
    try {
      if (!filePath || !fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto',
        max_file_size: 5242880 // 5MB
      });

      // Delete local file after upload
      fs.unlinkSync(filePath);

      console.log('✓ File uploaded to Cloudinary:', result.public_id);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        type: result.resource_type,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('✗ Failed to upload file:', error.message);
      throw new Error('File upload failed: ' + error.message);
    }
  },

  /**
   * Upload document for needy registration
   */
  uploadNeedyDocument: async (filePath, needyType) => {
    try {
      const folder = `hravinder/needy/${needyType.toLowerCase()}`;
      return await uploadService.uploadFile(filePath, folder);
    } catch (error) {
      console.error('✗ Failed to upload needy document:', error.message);
      throw error;
    }
  },

  /**
   * Upload user profile photo
   */
  uploadProfilePhoto: async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'hravinder/profiles',
        resource_type: 'image',
        transformation: [
          { width: 300, height: 300, crop: 'fill' }
        ]
      });

      fs.unlinkSync(filePath);
      console.log('✓ Profile photo uploaded:', result.public_id);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('✗ Failed to upload profile photo:', error.message);
      throw error;
    }
  },

  /**
   * Delete file from Cloudinary
   */
  deleteFile: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('✓ File deleted from Cloudinary:', publicId);
      return result;
    } catch (error) {
      console.error('✗ Failed to delete file:', error.message);
      throw error;
    }
  },

  /**
   * Get file info from Cloudinary
   */
  getFileInfo: async (publicId) => {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('✗ Failed to get file info:', error.message);
      throw error;
    }
  },

  /**
   * Validate file before upload
   */
  validateFile: (filePath, maxSize = 5242880, allowedMimes = ['application/pdf', 'image/jpeg', 'image/png']) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist');
      }

      const stats = fs.statSync(filePath);
      if (stats.size > maxSize) {
        throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      }

      // Note: MIME type validation would require additional libraries
      console.log('✓ File validation passed');
      return true;
    } catch (error) {
      console.error('✗ File validation failed:', error.message);
      throw error;
    }
  }
};

module.exports = uploadService;
