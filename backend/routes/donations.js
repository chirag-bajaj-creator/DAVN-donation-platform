const express = require('express');
const donationController = require('../controllers/donationController');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  submitDonationSchema,
  updateDonationStatusSchema
} = require('../schemas/donationSchema');

const router = express.Router();

/**
 * POST /api/donations
 * Submit a new donation
 */
router.post(
  '/',
  validate(submitDonationSchema),
  donationController.submitDonation
);

/**
 * GET /api/donations
 * Get user's donations with pagination
 */
router.get('/', donationController.getDonations);

/**
 * GET /api/donations/:id
 * Get specific donation by ID
 */
router.get('/:id', donationController.getDonationById);

/**
 * PATCH /api/donations/:id
 * Update donation status (admin only)
 */
router.patch(
  '/:id',
  authorize(['admin']),
  validate(updateDonationStatusSchema),
  donationController.updateDonationStatus
);

module.exports = router;
