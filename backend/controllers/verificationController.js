const VerificationReport = require('../models/VerificationReport');
const NeededIndividual = require('../models/NeededIndividual');
const NeededOrganization = require('../models/NeededOrganization');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { logger } = require('../config/logger');
const { emitRealtimeUpdate } = require('../services/socketService');

const verificationController = {
  /**
   * Get pending verifications (admin only)
   */
  getPendingVerifications: async (req, res, next) => {
    try {
      // Check admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can view pending verifications',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      const { limit = 20, skip = 0 } = req.query;
      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedSkip = parseInt(skip) || 0;

      // Get pending individuals
      const pendingIndividuals = await NeededIndividual.find({ status: 'pending' })
        .select('-documents')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ urgency: -1, createdAt: 1 });

      // Get pending organizations
      const pendingOrganizations = await NeededOrganization.find({ status: 'pending' })
        .select('-documents')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ urgency: -1, createdAt: 1 });

      const total = await NeededIndividual.countDocuments({ status: 'pending' })
        + await NeededOrganization.countDocuments({ status: 'pending' });

      const pending = [
        ...pendingIndividuals.map(ind => ({
          _id: ind._id,
          type: 'NeededIndividual',
          name: ind.name,
          phone: ind.phone,
          city: ind.address?.city,
          type_of_need: ind.type_of_need,
          urgency: ind.urgency,
          createdAt: ind.createdAt
        })),
        ...pendingOrganizations.map(org => ({
          _id: org._id,
          type: 'NeededOrganization',
          name: org.org_name,
          phone: org.phone,
          city: org.address?.city,
          type_of_need: org.type_of_need,
          urgency: org.urgency,
          createdAt: org.createdAt
        }))
      ];

      res.status(200).json({
        success: true,
        data: {
          pending,
          pagination: {
            total,
            limit: parsedLimit,
            skip: parsedSkip,
            pages: Math.ceil(total / parsedLimit)
          }
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Assign volunteer to verify (admin only)
   */
  assignVolunteer: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can assign volunteers',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      const { needy_id, needy_type, volunteer_id } = req.body;

      // Verify volunteer exists and is admin/volunteer
      const volunteer = await User.findById(volunteer_id);

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Create verification report for the volunteer
      const report = new VerificationReport({
        needy_id,
        needy_type,
        verified_by: volunteer_id,
        status: 'pending',
        trustScore: 0,
        recommendation: 'hold'
      });

      await report.save();

      const needyModel = needy_type === 'NeededOrganization' ? NeededOrganization : NeededIndividual;
      const needyRecord = await needyModel.findById(needy_id);
      if (needyRecord) {
        needyRecord.verified_by = volunteer_id;
        needyRecord.tracking = {
          ...(needyRecord.tracking?.toObject?.() || needyRecord.tracking || {}),
          status: 'assigned',
          assignedVolunteer: volunteer_id
        };
        needyRecord.updatedAt = new Date();
        await needyRecord.save();
      }

      emitRealtimeUpdate({
        adminEvent: 'admin:case-updated',
        userId: volunteer_id,
        userEvent: 'volunteer:assignment-created',
        payload: {
          caseId: needy_id,
          needyType: needy_type,
          volunteerId: volunteer_id,
          trackingStatus: 'assigned',
          updatedAt: new Date()
        }
      });

      res.status(201).json({
        success: true,
        message: 'Volunteer assigned successfully',
        data: {
          report_id: report._id,
          volunteer_id,
          needy_id,
          needy_type,
          status: report.status
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Submit verification report (volunteer)
   */
  submitReport: async (req, res, next) => {
    try {
      const { needy_id, needy_type, status, trustScore, recommendation, verificationDetails } = req.body;
      const volunteerId = req.user.userId;

      // Validate inputs
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status',
          code: 'INVALID_INPUT',
          timestamp: new Date()
        });
      }

      if (trustScore < 0 || trustScore > 100) {
        return res.status(400).json({
          success: false,
          error: 'Trust score must be between 0 and 100',
          code: 'INVALID_INPUT',
          timestamp: new Date()
        });
      }

      // Find existing report or create new
      let report = await VerificationReport.findOne({
        needy_id,
        needy_type,
        verified_by: volunteerId
      });

      if (!report) {
        report = new VerificationReport({
          needy_id,
          needy_type,
          verified_by: volunteerId
        });
      }

      // Update report
      report.status = status;
      report.trustScore = trustScore;
      report.recommendation = recommendation;
      report.verificationDetails = verificationDetails;
      report.verifiedAt = new Date();

      await report.save();

      res.status(201).json({
        success: true,
        message: 'Verification report submitted successfully',
        data: {
          report_id: report._id,
          needy_id,
          needy_type,
          status: report.status,
          trustScore: report.trustScore,
          recommendation: report.recommendation
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Approve or reject registration (admin only)
   */
  approveRejectRegistration: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can approve/reject registrations',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      const { needy_id, needy_type, status, comment } = req.body;

      // Validate status
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status must be either approved or rejected',
          code: 'INVALID_INPUT',
          timestamp: new Date()
        });
      }

      // Get needy record
      let needyRecord;
      if (needy_type === 'NeededIndividual') {
        needyRecord = await NeededIndividual.findById(needy_id);
      } else if (needy_type === 'NeededOrganization') {
        needyRecord = await NeededOrganization.findById(needy_id);
      }

      if (!needyRecord) {
        return res.status(404).json({
          success: false,
          error: 'Needy record not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Update status
      needyRecord.status = status === 'approved' ? 'verified' : 'rejected';
      needyRecord.verified_by = req.user.userId;
      await needyRecord.save();

      // Send email notification
      try {
        const email = needyRecord.email || needyRecord.contactPerson?.email;
        if (email) {
          await emailService.sendVerificationUpdate(
            email,
            needyRecord,
            status,
            comment
          );
        }
      } catch (emailError) {
        logger.warn(
          { err: emailError, needyId: needy_id, needyType: needy_type },
          'Failed to send verification email'
        );
      }

      res.status(200).json({
        success: true,
        message: `Registration ${status} successfully`,
        data: {
          needy_id,
          needy_type,
          status: needyRecord.status,
          comment
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = verificationController;
