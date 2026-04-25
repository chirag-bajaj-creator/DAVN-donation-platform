const NeededIndividual = require('../models/NeededIndividual');
const NeededOrganization = require('../models/NeededOrganization');
const Volunteer = require('../models/Volunteer');
const { coordinatesFromGeoLocation, haversineDistanceKm } = require('../utils/geo');
const { addTrackingClient, sendTrackingSnapshot } = require('../services/trackingStreamService');

function normalizeNeedyType(value) {
  if (value === 'organization' || value === 'NeededOrganization') return 'NeededOrganization';
  return 'NeededIndividual';
}

function getModel(needyType) {
  return normalizeNeedyType(needyType) === 'NeededOrganization'
    ? NeededOrganization
    : NeededIndividual;
}

function formatAddress(address) {
  if (!address) return 'Not available';
  return [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', ');
}

function canViewTracking(req, needyCase) {
  if (req.user?.role === 'admin') return true;

  const userId = req.user?.userId?.toString();
  if (!userId) return false;

  if (needyCase.requested_by?.toString() === userId) return true;
  if (needyCase.verified_by?.toString() === userId) return true;
  if (needyCase.tracking?.assignedVolunteer?.toString() === userId) return true;

  return false;
}

const trackingController = {
  buildTrackingData: async ({ req, needyType, caseId }) => {
    const resolvedType = normalizeNeedyType(needyType);
    const model = getModel(resolvedType);

    const needyCase = await model.findById(caseId)
      .populate('tracking.assignedVolunteer', 'name phone email')
      .populate('verified_by', 'name phone email');

    if (!needyCase) {
      const error = new Error('Tracked case not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (!canViewTracking(req, needyCase)) {
      const error = new Error('You do not have permission to view this tracking session');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    const volunteer = needyCase.tracking?.assignedVolunteer || needyCase.verified_by;
    const volunteerProfile = volunteer && !needyCase.tracking?.lastVolunteerLocation
      ? await Volunteer.findOne({ user_id: volunteer._id || volunteer }).select('currentLocation lastLocationAt')
      : null;
    const volunteerGeoLocation = needyCase.tracking?.lastVolunteerLocation || volunteerProfile?.currentLocation;
    const caseLocation = coordinatesFromGeoLocation(needyCase.address?.geoLocation);
    const volunteerLocation = coordinatesFromGeoLocation(volunteerGeoLocation);
    const distanceKm = haversineDistanceKm(volunteerLocation, caseLocation);

    return {
      case: {
        _id: needyCase._id,
        needyType: resolvedType,
        name: needyCase.name || needyCase.org_name,
        phone: needyCase.phone,
        type_of_need: needyCase.type_of_need,
        urgency: needyCase.urgency,
        status: needyCase.status,
        address: needyCase.address,
        addressText: formatAddress(needyCase.address),
        location: caseLocation
      },
      volunteer: volunteer ? {
        _id: volunteer._id,
        name: volunteer.name,
        phone: volunteer.phone,
        email: volunteer.email
      } : null,
      tracking: {
        status: needyCase.tracking?.status || 'not_assigned',
        acceptedAt: needyCase.tracking?.acceptedAt,
        startedAt: needyCase.tracking?.startedAt,
        completedAt: needyCase.tracking?.completedAt,
        lastLocationAt: volunteerGeoLocation?.capturedAt || volunteerProfile?.lastLocationAt,
        volunteerLocation,
        distanceKm: distanceKm === null ? null : Number(distanceKm.toFixed(2)),
        estimatedMinutes: distanceKm === null ? null : Math.max(1, Math.round((distanceKm / 20) * 60))
      }
    };
  },

  getCaseTracking: async (req, res, next) => {
    try {
      const { needyType, caseId } = req.params;
      const data = await trackingController.buildTrackingData({ req, needyType, caseId });

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.code
        });
      }
      next(error);
    }
  },

  streamCaseTracking: async (req, res, next) => {
    try {
      const { needyType, caseId } = req.params;
      const resolvedType = normalizeNeedyType(needyType);
      const data = await trackingController.buildTrackingData({ req, needyType, caseId });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no'
      });
      res.flushHeaders?.();

      addTrackingClient(resolvedType, caseId, res);
      sendTrackingSnapshot(res, data);

      const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
      }, 25000);

      res.on('close', () => {
        clearInterval(heartbeat);
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.code
        });
      }
      next(error);
    }
  },

  getMyTrackingCases: async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const [individuals, organizations] = await Promise.all([
        NeededIndividual.find({ requested_by: userId }).sort({ createdAt: -1 }).limit(20),
        NeededOrganization.find({ requested_by: userId }).sort({ createdAt: -1 }).limit(20)
      ]);

      const cases = [
        ...individuals.map((item) => ({
          _id: item._id,
          needyType: 'NeededIndividual',
          name: item.name,
          type_of_need: item.type_of_need,
          status: item.status,
          trackingStatus: item.tracking?.status || 'not_assigned',
          addressText: formatAddress(item.address),
          createdAt: item.createdAt
        })),
        ...organizations.map((item) => ({
          _id: item._id,
          needyType: 'NeededOrganization',
          name: item.org_name,
          type_of_need: item.type_of_need,
          status: item.status,
          trackingStatus: item.tracking?.status || 'not_assigned',
          addressText: formatAddress(item.address),
          createdAt: item.createdAt
        }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.status(200).json({
        success: true,
        data: cases,
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = trackingController;
