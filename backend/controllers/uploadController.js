const uploadService = require('../services/uploadService');
const fs = require('fs');
const path = require('path');

const uploadController = {
  /**
   * Upload file (generic)
   */
  uploadFile: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided',
          code: 'NO_FILE',
          timestamp: new Date()
        });
      }

      const folder = req.body.folder || 'hravinder/general';
      const result = await uploadService.uploadFile(req.file.path, folder);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: result.url,
          publicId: result.public_id,
          originalName: req.file.originalname,
          uploadedAt: result.uploadedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      // Clean up uploaded file if upload to Cloudinary fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  /**
   * Upload document for needy registration
   */
  uploadDocument: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No document provided',
          code: 'NO_FILE',
          timestamp: new Date()
        });
      }

      const needyType = req.body.needyType || 'general';
      const result = await uploadService.uploadNeedyDocument(req.file.path, needyType);

      res.status(200).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          url: result.url,
          publicId: result.public_id,
          originalName: req.file.originalname,
          uploadedAt: result.uploadedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  /**
   * Upload profile picture
   */
  uploadProfile: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No profile picture provided',
          code: 'NO_FILE',
          timestamp: new Date()
        });
      }

      const result = await uploadService.uploadProfilePhoto(req.file.path);

      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: {
          url: result.url,
          publicId: result.public_id,
          originalName: req.file.originalname,
          uploadedAt: result.uploadedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  /**
   * Delete file from Cloudinary
   */
  deleteFile: async (req, res, next) => {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          error: 'publicId is required',
          code: 'MISSING_PARAM',
          timestamp: new Date()
        });
      }

      await uploadService.deleteFile(publicId);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = uploadController;
