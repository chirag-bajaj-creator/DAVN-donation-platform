const express = require('express');
const neededController = require('../controllers/neededController');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const {
  registerIndividualSchema,
  registerOrganizationSchema
} = require('../schemas/neededSchema');

const router = express.Router();

/**
 * POST /api/needy/individuals
 * Register individual for help
 */
router.post(
  '/individuals',
  validate(registerIndividualSchema),
  neededController.registerIndividual
);

/**
 * POST /api/needy/organizations
 * Register organization for help
 */
router.post(
  '/organizations',
  validate(registerOrganizationSchema),
  neededController.registerOrganization
);

/**
 * GET /api/needy/verified
 * Get verified needy (individuals + organizations) with filters
 */
router.get('/verified', neededController.getVerifiedNeedy);

/**
 * GET /api/needy/individuals/:id
 * Get individual details by ID
 */
router.get(
  '/individuals/:id',
  neededController.getIndividualById
);

/**
 * GET /api/needy/organizations/:id
 * Get organization details by ID
 */
router.get(
  '/organizations/:id',
  neededController.getOrganizationById
);

module.exports = router;
