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
 * GET /api/volunteers/cases
 * Get cases assigned to the logged-in volunteer
 */
router.get(
  '/cases',
  authenticate,
  volunteerController.getCases
);

/**
 * GET /api/volunteers/available-cases
 * Get available unverified cases for volunteers
 */
router.get(
  '/available-cases',
  authenticate,
  volunteerController.getAvailableCases
);

/**
 * POST /api/volunteers/cases/:caseId/report
 * Submit a verification report for a case
 */
router.post(
  '/cases/:caseId/report',
  authenticate,
  volunteerController.submitReport
);

/**
 * POST /api/volunteers/cases/:caseId/accept
 * Accept a case for verification
 */
router.post(
  '/cases/:caseId/accept',
  authenticate,
  volunteerController.acceptCase
);

/**
 * POST /api/volunteers/cases/:caseId/reject
 * Reject/unassign a case for the logged-in volunteer
 */
router.post(
  '/cases/:caseId/reject',
  authenticate,
  volunteerController.rejectCase
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
