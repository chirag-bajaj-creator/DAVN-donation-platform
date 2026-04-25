const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const NeededIndividual = require('../models/NeededIndividual');
const NeededOrganization = require('../models/NeededOrganization');
const VerificationReport = require('../models/VerificationReport');
const { emitRealtimeUpdate } = require('../services/socketService');
const { emitTrackingUpdate } = require('../services/trackingStreamService');
const { normalizeCoordinates, coordinatesFromGeoLocation, haversineDistanceKm } = require('../utils/geo');

function normalizeNeedyType(needyType) {
  if (needyType === 'NeededOrganization' || needyType === 'organization') {
    return 'NeededOrganization';
  }

  return 'NeededIndividual';
}

function formatVolunteer(volunteer, targetLocation) {
  const location = coordinatesFromGeoLocation(volunteer.currentLocation);
  const distanceKm = haversineDistanceKm(location, targetLocation);

  return {
    _id: volunteer._id,
    user_id: volunteer.user_id,
    type: volunteer.type,
    specialization: volunteer.specialization,
    status: volunteer.status,
    rating: volunteer.rating,
    tasksCompleted: volunteer.tasksCompleted,
    currentLocation: location,
    lastLocationAt: volunteer.lastLocationAt,
    distanceKm: distanceKm === null ? null : Number(distanceKm.toFixed(2))
  };
}

const volunteerController = {
  findCaseById: async (caseId) => {
    const individual = await NeededIndividual.findById(caseId);
    if (individual) {
      return { needyCase: individual, needyType: 'NeededIndividual' };
    }

    const organization = await NeededOrganization.findById(caseId);
    if (organization) {
      return { needyCase: organization, needyType: 'NeededOrganization' };
    }

    return { needyCase: null, needyType: null };
  },

  /**
   * Register as specialized volunteer
   */
  registerSpecialized: async (req, res, next) => {
    try {
      const { specialization, documents } = req.body;
      const userId = req.user.userId;

      if (!specialization) {
        return res.status(400).json({
          success: false,
          error: 'Specialization is required',
          code: 'SPECIALIZATION_REQUIRED',
          timestamp: new Date()
        });
      }

      const existingVolunteer = await Volunteer.findOne({ user_id: userId });
      if (existingVolunteer) {
        return res.status(422).json({
          success: false,
          error: 'You are already registered as a volunteer',
          code: 'VOLUNTEER_EXISTS',
          timestamp: new Date()
        });
      }

      const volunteer = new Volunteer({
        user_id: userId,
        type: 'specialized',
        specialization,
        documents: documents || []
      });

      await volunteer.save();
      await User.findByIdAndUpdate(userId, { role: 'volunteer' });

      res.status(201).json({
        success: true,
        message: 'Registration submitted. Awaiting approval from admin.',
        data: {
          volunteer_id: volunteer._id,
          type: volunteer.type,
          specialization: volunteer.specialization,
          status: volunteer.status,
          createdAt: volunteer.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Register as unspecialized volunteer
   */
  registerUnspecialized: async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const existingVolunteer = await Volunteer.findOne({ user_id: userId });
      if (existingVolunteer) {
        return res.status(422).json({
          success: false,
          error: 'You are already registered as a volunteer',
          code: 'VOLUNTEER_EXISTS',
          timestamp: new Date()
        });
      }

      const volunteer = new Volunteer({
        user_id: userId,
        type: 'unspecialized',
        specialization: null,
        documents: []
      });

      await volunteer.save();
      await User.findByIdAndUpdate(userId, { role: 'volunteer' });

      res.status(201).json({
        success: true,
        message: 'Registration successful! You are now an active volunteer.',
        data: {
          volunteer_id: volunteer._id,
          type: volunteer.type,
          status: volunteer.status,
          createdAt: volunteer.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user's volunteer profile
   */
  getMe: async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const volunteer = await Volunteer.findOne({ user_id: userId })
        .populate('user_id', 'email name phone role');

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer profile not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          _id: volunteer._id,
          user_id: volunteer.user_id,
          type: volunteer.type,
          specialization: volunteer.specialization,
          documents: volunteer.documents,
          status: volunteer.status,
          verified_by: volunteer.verified_by,
          verifiedAt: volunteer.verifiedAt,
          rating: volunteer.rating,
          tasksCompleted: volunteer.tasksCompleted,
          createdAt: volunteer.createdAt,
          updatedAt: volunteer.updatedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all volunteers (public list)
   */
  getAll: async (req, res, next) => {
    try {
      const { limit = 20, skip = 0, status = 'active', type } = req.query;

      // Validate pagination
      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedSkip = parseInt(skip) || 0;

      // Build filter
      const filter = {};
      if (status) filter.status = status;
      if (type && ['specialized', 'unspecialized'].includes(type)) {
        filter.type = type;
      }

      const volunteers = await Volunteer.find(filter)
        .populate('user_id', 'name email phone')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ rating: -1, createdAt: -1 });

      const total = await Volunteer.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          volunteers: volunteers.map(v => ({
            _id: v._id,
            user_id: v.user_id,
            type: v.type,
            specialization: v.specialization,
            status: v.status,
            rating: v.rating,
            tasksCompleted: v.tasksCompleted,
            createdAt: v.createdAt
          })),
          pagination: {
            limit: parsedLimit,
            skip: parsedSkip,
            total
          }
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get pending volunteer registrations (admin only)
   */
  getPending: async (req, res, next) => {
    try {
      const { limit = 20, skip = 0 } = req.query;

      // Validate pagination
      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedSkip = parseInt(skip) || 0;

      const pendingVolunteers = await Volunteer.find({ status: 'pending' })
        .populate('user_id', 'name email phone address')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ createdAt: 1 });

      const total = await Volunteer.countDocuments({ status: 'pending' });

      res.status(200).json({
        success: true,
        data: {
          pending: pendingVolunteers.map(v => ({
            _id: v._id,
            user_id: v.user_id,
            type: v.type,
            specialization: v.specialization,
            documents: v.documents,
            createdAt: v.createdAt
          })),
          pagination: {
            limit: parsedLimit,
            skip: parsedSkip,
            total
          }
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Approve volunteer registration (admin only)
   */
  approve: async (req, res, next) => {
    try {
      const { id } = req.params;
      const adminId = req.user.userId;

      // Validate ID
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Volunteer ID is required',
          code: 'MISSING_ID',
          timestamp: new Date()
        });
      }

      const volunteer = await Volunteer.findById(id);

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      if (volunteer.status !== 'pending') {
        return res.status(422).json({
          success: false,
          error: `Cannot approve volunteer with status: ${volunteer.status}`,
          code: 'INVALID_STATUS',
          timestamp: new Date()
        });
      }

      // Update volunteer
      volunteer.status = 'approved';
      volunteer.verified_by = adminId;
      volunteer.verifiedAt = new Date();
      await volunteer.save();

      res.status(200).json({
        success: true,
        message: 'Volunteer approved successfully',
        data: {
          _id: volunteer._id,
          status: volunteer.status,
          verified_by: volunteer.verified_by,
          verifiedAt: volunteer.verifiedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get cases assigned to the logged-in volunteer
   */
  getCases: async (req, res, next) => {
    try {
      const userId = req.user.userId;

      // Get verification reports submitted by this volunteer
      const reports = await VerificationReport.find({ verified_by: userId });
      const verifiedNeedyIds = reports.map(r => r.needy_id);

      // Get needy individuals assigned to (verified by) this volunteer
      const assignedIndividuals = await NeededIndividual.find({
        $or: [
          { verified_by: userId },
          { _id: { $in: verifiedNeedyIds } }
        ]
      });

      const assignedOrgs = await NeededOrganization.find({
        $or: [
          { verified_by: userId },
          { _id: { $in: verifiedNeedyIds } }
        ]
      });

      const cases = [
        ...assignedIndividuals.map(c => ({
          _id: c._id,
          type: 'individual',
          name: c.name,
          phone: c.phone,
          address: c.address,
          type_of_need: c.type_of_need,
          urgency: c.urgency,
          description: c.description,
          status: c.status,
          uiStatus: c.status === 'pending' && c.verified_by?.toString() === userId ? 'accepted' : c.status,
          trustScore: c.trustScore,
          createdAt: c.createdAt,
          tracking: c.tracking,
          locationCoordinates: coordinatesFromGeoLocation(c.address?.geoLocation),
        })),
        ...assignedOrgs.map(c => ({
          _id: c._id,
          type: 'organization',
          name: c.org_name,
          phone: c.phone,
          address: c.address,
          type_of_need: c.type_of_need,
          urgency: c.urgency,
          description: c.description,
          status: c.status,
          uiStatus: c.status === 'pending' && c.verified_by?.toString() === userId ? 'accepted' : c.status,
          trustScore: c.trustScore,
          createdAt: c.createdAt,
          tracking: c.tracking,
          locationCoordinates: coordinatesFromGeoLocation(c.address?.geoLocation),
        })),
      ];

      res.status(200).json({
        success: true,
        data: cases,
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get available (unverified) cases for volunteers to pick up
   */
  getAvailableCases: async (req, res, next) => {
    try {
      const { type_of_need, urgency, limit = 20, skip = 0 } = req.query;

      const filter = { status: 'pending', isActive: true };
      if (type_of_need) filter.type_of_need = type_of_need;
      if (urgency) filter.urgency = urgency;

      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedSkip = parseInt(skip) || 0;

      const cases = await NeededIndividual.find(filter)
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ urgency: -1, createdAt: -1 });

      const total = await NeededIndividual.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          cases,
          pagination: { limit: parsedLimit, skip: parsedSkip, total }
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Accept a case assigned to or claimed by the logged-in volunteer
   */
  acceptCase: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { caseId } = req.params;

      const { needyCase, needyType } = await volunteerController.findCaseById(caseId);

      if (!needyCase) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      if (needyCase.status !== 'pending') {
        return res.status(422).json({
          success: false,
          error: `Cannot accept case with status: ${needyCase.status}`,
          code: 'INVALID_STATUS',
          timestamp: new Date()
        });
      }

      if (needyCase.verified_by && needyCase.verified_by.toString() !== userId) {
        return res.status(409).json({
          success: false,
          error: 'Case is already assigned to another volunteer',
          code: 'ALREADY_ASSIGNED',
          timestamp: new Date()
        });
      }

      needyCase.verified_by = userId;
      needyCase.tracking = {
        ...(needyCase.tracking?.toObject?.() || needyCase.tracking || {}),
        status: 'accepted',
        assignedVolunteer: userId,
        acceptedAt: new Date()
      };
      needyCase.updatedAt = new Date();
      await needyCase.save();

      emitRealtimeUpdate({
        adminEvent: 'admin:case-updated',
        userId,
        userEvent: 'volunteer:case-updated',
        payload: {
          caseId: needyCase._id,
          needyType,
          action: 'accepted',
          status: needyCase.status,
          trackingStatus: needyCase.tracking?.status,
          updatedAt: needyCase.updatedAt
        }
      });

      res.status(200).json({
        success: true,
        message: 'Case accepted successfully',
        data: {
          _id: needyCase._id,
          needy_type: needyType,
          status: needyCase.status,
          tracking: needyCase.tracking,
          verified_by: needyCase.verified_by,
          updatedAt: needyCase.updatedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reject a case currently assigned to the logged-in volunteer
   */
  rejectCase: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { caseId } = req.params;

      const { needyCase, needyType } = await volunteerController.findCaseById(caseId);

      if (!needyCase) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      if (!needyCase.verified_by || needyCase.verified_by.toString() !== userId) {
        return res.status(403).json({
          success: false,
          error: 'You can only reject cases assigned to you',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      needyCase.verified_by = null;
      needyCase.tracking = {
        ...(needyCase.tracking?.toObject?.() || needyCase.tracking || {}),
        status: 'cancelled',
        assignedVolunteer: null
      };
      needyCase.updatedAt = new Date();
      await needyCase.save();

      emitRealtimeUpdate({
        adminEvent: 'admin:case-updated',
        userId,
        userEvent: 'volunteer:case-updated',
        payload: {
          caseId: needyCase._id,
          needyType,
          action: 'rejected',
          status: needyCase.status,
          updatedAt: needyCase.updatedAt
        }
      });

      res.status(200).json({
        success: true,
        message: 'Case rejected successfully',
        data: {
          _id: needyCase._id,
          needy_type: needyType,
          status: needyCase.status,
          verified_by: needyCase.verified_by,
          updatedAt: needyCase.updatedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Submit a verification report for a case
   */
  submitReport: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { caseId } = req.params;
      const { trustScore, recommendation, verificationDetails, needy_type } = req.body;

      // Check the case exists
      const resolvedType = normalizeNeedyType(needy_type || req.query.needyType);
      const needyModel = resolvedType === 'NeededOrganization'
        ? NeededOrganization
        : NeededIndividual;
      const needyCase = await needyModel.findById(caseId);

      if (!needyCase) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      const report = new VerificationReport({
        needy_id: caseId,
        needy_type: resolvedType,
        verified_by: userId,
        trustScore: trustScore || 0,
        recommendation: recommendation || 'hold',
        verificationDetails: verificationDetails || {},
      });

      await report.save();

      // Update the needy record
      needyCase.verified_by = userId;
      needyCase.status = 'verified';
      needyCase.trustScore = trustScore || 0;
      needyCase.tracking = {
        ...(needyCase.tracking?.toObject?.() || needyCase.tracking || {}),
        status: 'completed',
        completedAt: new Date()
      };
      await needyCase.save();

      emitRealtimeUpdate({
        adminEvent: 'admin:report-submitted',
        userId,
        userEvent: 'volunteer:report-submitted',
        payload: {
          caseId,
          reportId: report._id,
          needyType: report.needy_type,
          recommendation: report.recommendation,
          trustScore: report.trustScore,
          createdAt: report.createdAt
        }
      });

      res.status(201).json({
        success: true,
        message: 'Verification report submitted successfully',
        data: {
          report_id: report._id,
          needy_id: caseId,
          needy_type: report.needy_type,
          status: report.status,
          recommendation: report.recommendation,
          createdAt: report.createdAt,
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reject volunteer registration (admin only)
   */
  reject: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user.userId;

      // Validate ID
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Volunteer ID is required',
          code: 'MISSING_ID',
          timestamp: new Date()
        });
      }

      const volunteer = await Volunteer.findById(id);

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      if (volunteer.status !== 'pending') {
        return res.status(422).json({
          success: false,
          error: `Cannot reject volunteer with status: ${volunteer.status}`,
          code: 'INVALID_STATUS',
          timestamp: new Date()
        });
      }

      // Update volunteer
      volunteer.status = 'rejected';
      volunteer.verified_by = adminId;
      volunteer.verifiedAt = new Date();
      await volunteer.save();

      res.status(200).json({
        success: true,
        message: 'Volunteer rejected',
        data: {
          _id: volunteer._id,
          status: volunteer.status,
          verified_by: volunteer.verified_by,
          verifiedAt: volunteer.verifiedAt,
          reason: reason || null
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update current volunteer GPS location and active tracking cases
   */
  updateLocation: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const location = normalizeCoordinates(req.body);

      if (!location) {
        return res.status(422).json({
          success: false,
          error: 'Valid latitude and longitude are required',
          code: 'INVALID_LOCATION'
        });
      }

      const volunteer = await Volunteer.findOneAndUpdate(
        { user_id: userId },
        {
          currentLocation: location,
          locationSharing: true,
          lastLocationAt: location.capturedAt,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer profile not found',
          code: 'NOT_FOUND'
        });
      }

      const targetFilter = {
        verified_by: userId,
        status: 'pending',
        'tracking.status': { $in: ['assigned', 'accepted', 'in_route'] }
      };
      const trackingUpdate = {
        'tracking.status': 'in_route',
        'tracking.startedAt': new Date(),
        'tracking.lastVolunteerLocation': location,
        updatedAt: new Date()
      };

      const [activeIndividuals, activeOrganizations] = await Promise.all([
        NeededIndividual.find(targetFilter)
          .populate('tracking.assignedVolunteer', 'name phone email')
          .populate('verified_by', 'name phone email'),
        NeededOrganization.find(targetFilter)
          .populate('tracking.assignedVolunteer', 'name phone email')
          .populate('verified_by', 'name phone email')
      ]);

      const [individualUpdate, organizationUpdate] = await Promise.all([
        NeededIndividual.updateMany(targetFilter, { $set: trackingUpdate }),
        NeededOrganization.updateMany(targetFilter, { $set: trackingUpdate })
      ]);

      const locationCoordinates = coordinatesFromGeoLocation(location);
      const emitCaseTracking = (needyCase, needyType) => {
        const caseLocation = coordinatesFromGeoLocation(needyCase.address?.geoLocation);
        const distanceKm = haversineDistanceKm(locationCoordinates, caseLocation);
        const volunteerUser = needyCase.tracking?.assignedVolunteer || needyCase.verified_by;

        emitTrackingUpdate(needyType, needyCase._id, {
          case: {
            _id: needyCase._id,
            needyType,
            name: needyCase.name || needyCase.org_name,
            phone: needyCase.phone,
            type_of_need: needyCase.type_of_need,
            urgency: needyCase.urgency,
            status: needyCase.status,
            address: needyCase.address,
            addressText: [needyCase.address?.street, needyCase.address?.city, needyCase.address?.state, needyCase.address?.zipCode]
              .filter(Boolean)
              .join(', '),
            location: caseLocation
          },
          volunteer: volunteerUser ? {
            _id: volunteerUser._id,
            name: volunteerUser.name,
            phone: volunteerUser.phone,
            email: volunteerUser.email
          } : null,
          tracking: {
            status: 'in_route',
            acceptedAt: needyCase.tracking?.acceptedAt,
            startedAt: trackingUpdate['tracking.startedAt'],
            completedAt: needyCase.tracking?.completedAt,
            lastLocationAt: location.capturedAt,
            volunteerLocation: locationCoordinates,
            distanceKm: distanceKm === null ? null : Number(distanceKm.toFixed(2)),
            estimatedMinutes: distanceKm === null ? null : Math.max(1, Math.round((distanceKm / 20) * 60))
          }
        });
      };

      activeIndividuals.forEach((needyCase) => emitCaseTracking(needyCase, 'NeededIndividual'));
      activeOrganizations.forEach((needyCase) => emitCaseTracking(needyCase, 'NeededOrganization'));

      emitRealtimeUpdate({
        adminEvent: 'admin:volunteer-location-updated',
        userId,
        userEvent: 'volunteer:location-updated',
        payload: {
          volunteerId: volunteer._id,
          userId,
          location: locationCoordinates,
          updatedAt: location.capturedAt,
          affectedCases: (individualUpdate.modifiedCount || 0) + (organizationUpdate.modifiedCount || 0)
        }
      });

      res.status(200).json({
        success: true,
        message: 'Location updated',
        data: {
          location: coordinatesFromGeoLocation(location),
          updatedAt: location.capturedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Find nearest active/approved volunteers for a needy case
   */
  getNearestVolunteers: async (req, res, next) => {
    try {
      const { caseId } = req.params;
      const { needyType = 'NeededIndividual', limit = 10 } = req.query;
      const { needyCase } = await volunteerController.findCaseById(caseId);

      if (!needyCase) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'NOT_FOUND'
        });
      }

      const targetLocation = coordinatesFromGeoLocation(needyCase.address?.geoLocation);
      if (!targetLocation) {
        return res.status(422).json({
          success: false,
          error: 'This case does not have GPS coordinates for location matching',
          code: 'CASE_LOCATION_MISSING'
        });
      }

      const parsedLimit = Math.min(parseInt(limit) || 10, 25);
      const volunteers = await Volunteer.find({
        status: { $in: ['active', 'approved'] },
        currentLocation: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [targetLocation.lng, targetLocation.lat]
            },
            $maxDistance: 50000
          }
        }
      })
        .populate('user_id', 'name email phone')
        .limit(parsedLimit);

      res.status(200).json({
        success: true,
        data: {
          caseId,
          needyType,
          targetLocation,
          volunteers: volunteers.map((volunteer) => formatVolunteer(volunteer, targetLocation))
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = volunteerController;
