const express = require('express');
const authenticate = require('../middleware/authenticate');
const eventStreamAuthenticate = require('../middleware/eventStreamAuthenticate');
const trackingController = require('../controllers/trackingController');

const router = express.Router();

router.get('/mine', authenticate, trackingController.getMyTrackingCases);
router.get('/:needyType/:caseId/stream', eventStreamAuthenticate, trackingController.streamCaseTracking);
router.get('/:needyType/:caseId', authenticate, trackingController.getCaseTracking);

module.exports = router;
