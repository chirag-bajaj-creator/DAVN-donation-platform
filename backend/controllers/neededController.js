const NeededIndividual = require('../models/NeededIndividual');
const NeededOrganization = require('../models/NeededOrganization');
const { normalizeCoordinates } = require('../utils/geo');

const neededController = {
  /**
   * Register individual for help
   */
  registerIndividual: async (req, res, next) => {
    try {
      const { name, phone, email, address, type_of_need, urgency, description } = req.validatedData;
      const geoLocation = normalizeCoordinates(address?.geoLocation);

      // Check if phone already registered
      const existingIndividual = await NeededIndividual.findOne({ phone });

      if (existingIndividual && existingIndividual.status !== 'rejected') {
        return res.status(422).json({
          success: false,
          error: 'This phone number is already registered',
          code: 'DUPLICATE_ENTRY',
          timestamp: new Date()
        });
      }

      const individual = new NeededIndividual({
        name,
        phone,
        email,
        address: {
          ...address,
          ...(geoLocation ? { geoLocation } : {})
        },
        type_of_need,
        urgency,
        description,
        requested_by: req.user?.userId || null,
        status: 'pending',
        trustScore: 0
      });

      await individual.save();

      res.status(201).json({
        success: true,
        message: 'Registration submitted. Your application is pending verification',
        data: {
          needy_id: individual._id,
          status: individual.status,
          createdAt: individual.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Register organization for help
   */
  registerOrganization: async (req, res, next) => {
    try {
      const {
        org_name,
        registration_number,
        org_type,
        phone,
        address,
        contactPerson,
        type_of_need,
        urgency,
        description
      } = req.validatedData;
      const geoLocation = normalizeCoordinates(address?.geoLocation);

      // Check if registration number already exists
      const existingOrg = await NeededOrganization.findOne({ registration_number });

      if (existingOrg && existingOrg.status !== 'rejected') {
        return res.status(422).json({
          success: false,
          error: 'This registration number is already registered',
          code: 'DUPLICATE_ENTRY',
          timestamp: new Date()
        });
      }

      const organization = new NeededOrganization({
        org_name,
        registration_number,
        org_type,
        phone,
        address: {
          ...address,
          ...(geoLocation ? { geoLocation } : {})
        },
        contactPerson,
        type_of_need,
        urgency,
        description,
        requested_by: req.user?.userId || null,
        status: 'pending',
        credibilityScore: 0
      });

      await organization.save();

      res.status(201).json({
        success: true,
        message: 'Organization registration submitted. Your application is pending verification',
        data: {
          needy_id: organization._id,
          status: organization.status,
          createdAt: organization.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get verified needy (individuals + organizations) with filters
   */
  getVerifiedNeedy: async (req, res, next) => {
    try {
      const { type_of_need, urgency, city, limit = 20, skip = 0 } = req.query;

      // Validate pagination
      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedSkip = parseInt(skip) || 0;

      // Build filter for verified records
      const filter = { status: 'verified', isActive: true };

      if (type_of_need) {
        filter.type_of_need = type_of_need;
      }

      if (urgency) {
        filter.urgency = urgency;
      }

      if (city) {
        filter['address.city'] = { $regex: city, $options: 'i' };
      }

      // Get verified individuals
      const individuals = await NeededIndividual.find(filter)
        .select('-documents -verified_by')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ trustScore: -1, createdAt: -1 });

      // Get verified organizations
      const organizations = await NeededOrganization.find(filter)
        .select('-documents -verified_by')
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ credibilityScore: -1, createdAt: -1 });

      // Count totals
      const totalIndividuals = await NeededIndividual.countDocuments(filter);
      const totalOrganizations = await NeededOrganization.countDocuments(filter);
      const total = totalIndividuals + totalOrganizations;

      // Combine and format response
      const needy = [
        ...individuals.map(ind => ({
          _id: ind._id,
          type: 'individual',
          name: ind.name,
          phone: ind.phone,
          city: ind.address?.city,
          type_of_need: ind.type_of_need,
          urgency: ind.urgency,
          description: ind.description,
          score: ind.trustScore,
          createdAt: ind.createdAt
        })),
        ...organizations.map(org => ({
          _id: org._id,
          type: 'organization',
          name: org.org_name,
          phone: org.phone,
          city: org.address?.city,
          type_of_need: org.type_of_need,
          urgency: org.urgency,
          description: org.description,
          score: org.credibilityScore,
          createdAt: org.createdAt
        }))
      ];

      res.status(200).json({
        success: true,
        data: {
          needy,
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
   * Get individual details by ID
   */
  getIndividualById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const individual = await NeededIndividual.findById(id)
        .select('-documents')
        .populate('verified_by', 'name email');

      if (!individual) {
        return res.status(404).json({
          success: false,
          error: 'Individual not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Only show verified individuals to non-admins
      if (individual.status !== 'verified' && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'This record is not publicly available',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          _id: individual._id,
          name: individual.name,
          phone: individual.phone,
          email: individual.email,
          address: individual.address,
          type_of_need: individual.type_of_need,
          urgency: individual.urgency,
          description: individual.description,
          status: individual.status,
          trustScore: individual.trustScore,
          verified_by: individual.verified_by,
          createdAt: individual.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get organization details by ID
   */
  getOrganizationById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const organization = await NeededOrganization.findById(id)
        .select('-documents')
        .populate('verified_by', 'name email');

      if (!organization) {
        return res.status(404).json({
          success: false,
          error: 'Organization not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Only show verified orgs to non-admins
      if (organization.status !== 'verified' && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'This record is not publicly available',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          _id: organization._id,
          org_name: organization.org_name,
          registration_number: organization.registration_number,
          org_type: organization.org_type,
          phone: organization.phone,
          address: organization.address,
          contactPerson: organization.contactPerson,
          type_of_need: organization.type_of_need,
          urgency: organization.urgency,
          description: organization.description,
          status: organization.status,
          credibilityScore: organization.credibilityScore,
          verified_by: organization.verified_by,
          createdAt: organization.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = neededController;
