const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WebP, and PDF allowed.'));
    }
  }
});

/**
 * POST /api/uploads
 * Upload generic file
 */
router.post('/', upload.single('file'), uploadController.uploadFile);

/**
 * POST /api/uploads/document
 * Upload document for needy registration
 */
router.post('/document', upload.single('file'), uploadController.uploadDocument);

/**
 * POST /api/uploads/profile
 * Upload profile picture
 */
router.post('/profile', upload.single('file'), uploadController.uploadProfile);

/**
 * POST /api/uploads/delete
 * Delete file from Cloudinary
 */
router.post('/delete', uploadController.deleteFile);

module.exports = router;
