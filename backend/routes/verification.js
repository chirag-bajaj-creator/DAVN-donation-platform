const express = require('express');
const verificationController = require('../controllers/verificationController');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * GET /api/verification/pending
 * Get pending verifications (admin only)
 */
router.get(
  '/pending',
  authorize(['admin']),
  verificationController.getPendingVerifications
);

/**
 * POST /api/verification/assign
 * Assign volunteer to verify (admin only)
 */
router.post(
  '/assign',
  authorize(['admin']),
  verificationController.assignVolunteer
);

/**
 * POST /api/verification/reports
 * Submit verification report (volunteer)
 */
router.post(
  '/reports',
  verificationController.submitReport
);

/**
 * PATCH /api/verification/:id
 * Approve or reject registration (admin only)
 */
router.patch(
  '/:id',
  authorize(['admin']),
  verificationController.approveRejectRegistration
);

module.exports = router;
