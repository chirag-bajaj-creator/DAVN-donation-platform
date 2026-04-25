const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Donation = require('../models/Donation');
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const NeededIndividual = require('../models/NeededIndividual');
const NeededOrganization = require('../models/NeededOrganization');
const VerificationReport = require('../models/VerificationReport');
const reportPdfService = require('../services/reportPdfService');
const { emitRealtimeUpdate, emitToAdmins } = require('../services/socketService');

const router = express.Router();

/**
 * GET /api/admin/donations
 * Get all donations (admin only)
 */
router.get(
  '/donations',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { limit = 50, skip = 0, status } = req.query;

      const parsedLimit = Math.min(parseInt(limit) || 50, 100);
      const parsedSkip = parseInt(skip) || 0;

      const filter = {};
      if (status) filter.status = status;

      const donations = await Donation.find(filter)
        .populate('donor_id', 'name email phone')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ createdAt: -1 });

      const total = await Donation.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          donations: donations.map(d => ({
            _id: d._id,
            donor_id: d.donor_id,
            type: d.type,
            amount: d.amount,
            status: d.status,
            details: d.details,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
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
  }
);

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get(
  '/users',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { limit = 50, skip = 0, role } = req.query;

      const parsedLimit = Math.min(parseInt(limit) || 50, 100);
      const parsedSkip = parseInt(skip) || 0;

      const filter = {};
      if (role && ['user', 'admin', 'volunteer'].includes(role)) {
        filter.role = role;
      }

      const users = await User.find(filter)
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          users: users.map(u => ({
            _id: u._id,
            email: u.email,
            name: u.name,
            phone: u.phone,
            role: u.role,
            isActive: u.isActive,
            isEmailVerified: u.isEmailVerified,
            createdAt: u.createdAt
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
  }
);

/**
 * PATCH /api/admin/users/:id/role
 * Update user role (admin only)
 */
router.patch(
  '/users/:id/role',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate input
      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Role is required',
          code: 'MISSING_ROLE',
          timestamp: new Date()
        });
      }

      if (!['user', 'admin', 'volunteer'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be user, admin, or volunteer',
          code: 'INVALID_ROLE',
          timestamp: new Date()
        });
      }

      // Prevent self-demotion
      if (id === req.user.userId && role !== 'admin') {
        return res.status(422).json({
          success: false,
          error: 'Cannot change your own role',
          code: 'SELF_ROLE_CHANGE',
          timestamp: new Date()
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/volunteers
 * Get all volunteers with filters (admin only)
 */
router.get(
  '/volunteers',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const parsedPage = parseInt(page) || 1;
      const parsedLimit = Math.min(parseInt(limit) || 10, 100);
      const skip = (parsedPage - 1) * parsedLimit;

      const filter = {};
      if (status) filter.status = status;

      const volunteers = await Volunteer.find(filter)
        .populate('user_id', 'name email phone')
        .limit(parsedLimit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Volunteer.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          volunteers: volunteers.map(v => ({
            _id: v._id,
            name: v.user_id?.name || 'Unknown',
            email: v.user_id?.email || 'Unknown',
            phone: v.user_id?.phone || 'Unknown',
            status: v.status,
            specialization: v.specialization,
            createdAt: v.createdAt
          })),
          total,
          pagination: {
            page: parsedPage,
            limit: parsedLimit,
            total
          }
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/admin/volunteers/:id/approve
 * Approve volunteer registration (admin only)
 */
router.patch(
  '/volunteers/:id/approve',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const volunteer = await Volunteer.findByIdAndUpdate(
        id,
        { status: 'approved', updatedAt: new Date() },
        { new: true }
      );

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      emitToAdmins('admin:volunteer-updated', {
        volunteerId: volunteer._id,
        status: volunteer.status,
        updatedAt: volunteer.updatedAt
      });

      res.status(200).json({
        success: true,
        message: 'Volunteer approved successfully',
        data: volunteer,
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/admin/volunteers/:id/reject
 * Reject volunteer registration (admin only)
 */
router.patch(
  '/volunteers/:id/reject',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const volunteer = await Volunteer.findByIdAndUpdate(
        id,
        { status: 'rejected', rejectionReason: reason, updatedAt: new Date() },
        { new: true }
      );

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      emitToAdmins('admin:volunteer-updated', {
        volunteerId: volunteer._id,
        status: volunteer.status,
        updatedAt: volunteer.updatedAt
      });

      res.status(200).json({
        success: true,
        message: 'Volunteer rejected successfully',
        data: volunteer,
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/needy/pending
 * Get pending needy registrations (admin only)
 */
router.get(
  '/needy/pending',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const parsedPage = parseInt(page) || 1;
      const parsedLimit = Math.min(parseInt(limit) || 10, 100);
      const skip = (parsedPage - 1) * parsedLimit;

      // Get pending from NeededIndividual model
      const needy = await NeededIndividual.find({ status: 'pending' })
        .limit(parsedLimit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await NeededIndividual.countDocuments({ status: 'pending' });

      res.status(200).json({
        success: true,
        data: {
          needy: needy.map(n => ({
            _id: n._id,
            name: n.name,
            email: n.email,
            phone: n.phone,
            address: n.address,
            type_of_need: n.type_of_need,
            urgency: n.urgency,
            description: n.description,
            status: n.status,
            createdAt: n.createdAt
          })),
          total,
          pagination: {
            page: parsedPage,
            limit: parsedLimit,
            total
          }
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/admin/needy/:id/assign
 * Assign volunteer to verify needy (admin only)
 */
router.post(
  '/needy/:id/assign',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { volunteerId } = req.body;

      if (!volunteerId) {
        return res.status(400).json({
          success: false,
          error: 'Volunteer ID is required',
          code: 'MISSING_VOLUNTEER_ID',
          timestamp: new Date()
        });
      }

      const needy = await NeededIndividual.findById(id);
      if (!needy) {
        return res.status(404).json({
          success: false,
          error: 'Needy not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      const volunteer = await Volunteer.findById(volunteerId).populate('user_id', 'name email');
      if (!volunteer) {
        return res.status(404).json({
          success: false,
          error: 'Volunteer not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      if (!volunteer.user_id) {
        return res.status(422).json({
          success: false,
          error: 'Volunteer user account is missing',
          code: 'VOLUNTEER_USER_MISSING',
          timestamp: new Date()
        });
      }

      if (!['approved', 'active'].includes(volunteer.status)) {
        return res.status(422).json({
          success: false,
          error: 'Only approved or active volunteers can be assigned',
          code: 'VOLUNTEER_NOT_ASSIGNABLE',
          timestamp: new Date()
        });
      }

      const existingAssignment = await VerificationReport.findOne({
        needy_id: id,
        needy_type: 'NeededIndividual',
        verified_by: volunteer.user_id._id,
        status: 'pending'
      });

      if (existingAssignment) {
        return res.status(422).json({
          success: false,
          error: 'This volunteer is already assigned to this needy case',
          code: 'ASSIGNMENT_EXISTS',
          timestamp: new Date()
        });
      }

      const report = new VerificationReport({
        needy_id: id,
        needy_type: 'NeededIndividual',
        verified_by: volunteer.user_id._id,
        status: 'pending',
        trustScore: 0,
        recommendation: 'hold'
      });

      await report.save();

      needy.verified_by = volunteer.user_id._id;
      needy.tracking = {
        ...(needy.tracking?.toObject?.() || needy.tracking || {}),
        status: 'assigned',
        assignedVolunteer: volunteer.user_id._id
      };
      needy.updatedAt = new Date();
      await needy.save();

      emitRealtimeUpdate({
        adminEvent: 'admin:assignment-created',
        userId: volunteer.user_id._id,
        userEvent: 'volunteer:assignment-created',
        payload: {
          needyId: id,
          volunteerId: volunteer._id,
          volunteerUserId: volunteer.user_id._id,
          volunteerName: volunteer.user_id.name || volunteer.user_id.email,
          reportId: report._id
        }
      });

      res.status(200).json({
        success: true,
        message: 'Volunteer assigned successfully',
        data: {
          needyId: id,
          volunteerId: volunteer._id,
          volunteerUserId: volunteer.user_id._id,
          volunteerName: volunteer.user_id.name || volunteer.user_id.email,
          reportId: report._id
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/verification-reports
 * Get submitted verification reports (admin only)
 */
router.get(
  '/verification-reports',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const { limit = 20, skip = 0 } = req.query;

      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedSkip = parseInt(skip) || 0;

      const reports = await VerificationReport.find({})
        .populate('verified_by', 'name email')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ createdAt: -1 });

      const total = await VerificationReport.countDocuments();

      res.status(200).json({
        success: true,
        data: {
          reports: reports.map(report => ({
            _id: report._id,
            needy_id: report.needy_id,
            needy_type: report.needy_type,
            verified_by: report.verified_by,
            status: report.status,
            trustScore: report.trustScore,
            recommendation: report.recommendation,
            verificationDetails: report.verificationDetails,
            createdAt: report.createdAt,
            verifiedAt: report.verifiedAt
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
  }
);

/**
 * GET /api/admin/verification-reports/:id/pdf
 * Download a verification report as PDF (admin only)
 */
router.get(
  '/verification-reports/:id/pdf',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const report = await VerificationReport.findById(req.params.id)
        .populate('verified_by', 'name email');

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Verification report not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      const pdfBuffer = reportPdfService.createPdfBuffer(report);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="verification-report-${report._id}.pdf"`
      );
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/stats
 * Get dashboard statistics (admin only)
 */
router.get(
  '/stats',
  authenticate,
  authorize(['admin']),
  async (req, res, next) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalVolunteers = await Volunteer.countDocuments();
      const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });
      const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' });
      const totalDonations = await Donation.countDocuments();
      const approvedDonations = await Donation.countDocuments({ status: 'approved' });
      const pendingVerification = await NeededIndividual.countDocuments({ status: 'pending' });

      // Get donation stats
      const donationStats = await Donation.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalVolunteers,
          totalDonations,
          pendingVerification,
          users: {
            total: totalUsers
          },
          volunteers: {
            total: totalVolunteers,
            active: activeVolunteers,
            pending: pendingVolunteers
          },
          donations: {
            total: totalDonations,
            approved: approvedDonations,
            stats: donationStats
          }
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
