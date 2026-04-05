const Donation = require('../models/Donation');
const emailService = require('../services/emailService');
const User = require('../models/User');

const donationController = {
  /**
   * Submit a new donation
   */
  submitDonation: async (req, res, next) => {
    try {
      const { type, amount, details } = req.validatedData;
      const userId = req.user.userId;

      const donation = new Donation({
        donor_id: userId,
        type,
        amount,
        details,
        status: 'submitted'
      });

      await donation.save();

      // Populate donor info for email
      const donor = await User.findById(userId);

      // Send confirmation email (non-blocking)
      try {
        await emailService.sendDonationConfirmation(donor.email, donation);
      } catch (emailError) {
        console.error('Email notification failed:', emailError.message);
      }

      res.status(201).json({
        success: true,
        message: 'Donation submitted successfully',
        data: {
          donation_id: donation._id,
          type: donation.type,
          amount: donation.amount,
          status: donation.status,
          createdAt: donation.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user's donations with pagination
   */
  getDonations: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { limit = 20, skip = 0 } = req.query;

      // Validate pagination
      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedSkip = parseInt(skip) || 0;

      const donations = await Donation.find({ donor_id: userId, isActive: true })
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ createdAt: -1 });

      const total = await Donation.countDocuments({ donor_id: userId, isActive: true });

      res.status(200).json({
        success: true,
        data: {
          donations: donations.map(d => ({
            _id: d._id,
            type: d.type,
            amount: d.amount,
            status: d.status,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          })),
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
   * Get specific donation by ID
   */
  getDonationById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const donation = await Donation.findById(id)
        .populate('donor_id', 'name email phone')
        .populate('qr_payment_id');

      if (!donation) {
        return res.status(404).json({
          success: false,
          error: 'Donation not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Check if user owns the donation (unless admin)
      if (donation.donor_id._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to view this donation',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          _id: donation._id,
          type: donation.type,
          amount: donation.amount,
          status: donation.status,
          details: donation.details,
          qr_payment: donation.qr_payment_id,
          donor: donation.donor_id,
          createdAt: donation.createdAt,
          updatedAt: donation.updatedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update donation status (admin only)
   */
  updateDonationStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.validatedData;

      // Only admin can update status
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can update donation status',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      const donation = await Donation.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!donation) {
        return res.status(404).json({
          success: false,
          error: 'Donation not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      res.status(200).json({
        success: true,
        message: 'Donation status updated successfully',
        data: {
          _id: donation._id,
          type: donation.type,
          status: donation.status,
          updatedAt: donation.updatedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = donationController;
