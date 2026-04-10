const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * POST /api/volunteer/register/specialized
 * Register as a specialized volunteer (auth required)
 */
router.post(
  '/register/specialized',
  authenticate,
  volunteerController.registerSpecialized
);

/**
 * POST /api/volunteer/register/unspecialized
 * Register as an unspecialized volunteer (auth required)
 */
router.post(
  '/register/unspecialized',
  authenticate,
  volunteerController.registerUnspecialized
);

/**
 * GET /api/volunteers
 * Get all volunteers (public)
 */
router.get(
  '/',
  volunteerController.getAll
);

/**
 * GET /api/volunteers/me
 * Get current user's volunteer profile (auth required)
 */
router.get(
  '/me',
  authenticate,
  volunteerController.getMe
);

/**
 * GET /api/volunteers/pending
 * Get pending volunteer registrations (admin only)
 */
router.get(
  '/pending',
  authenticate,
  authorize(['admin']),
  volunteerController.getPending
);

/**
 * PATCH /api/volunteers/:id/approve
 * Approve volunteer registration (admin only)
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize(['admin']),
  volunteerController.approve
);

/**
 * PATCH /api/volunteers/:id/reject
 * Reject volunteer registration (admin only)
 */
router.patch(
  '/:id/reject',
  authenticate,
  authorize(['admin']),
  volunteerController.reject
);

module.exports = router;
