const Joi = require('joi');

const geoLocationSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).optional(),
  lng: Joi.number().min(-180).max(180).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  accuracy: Joi.number().min(0).optional(),
  source: Joi.string().optional(),
  capturedAt: Joi.date().optional()
}).optional();

const registerIndividualSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a 10-digit number',
      'any.required': 'Phone is required'
    }),
  email: Joi.string()
    .email()
    .optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    geoLocation: geoLocationSchema
  }).required(),
  type_of_need: Joi.string()
    .valid('food', 'shelter', 'medical', 'basic_needs', 'education', 'employment', 'disaster_relief')
    .required(),
  urgency: Joi.string()
    .valid('low', 'medium', 'high', 'critical')
    .default('medium'),
  description: Joi.string()
    .min(50)
    .required()
    .messages({
      'string.min': 'Description must be at least 50 characters',
      'any.required': 'Description is required'
    })
});

const registerOrganizationSchema = Joi.object({
  org_name: Joi.string()
    .min(3)
    .required()
    .messages({
      'any.required': 'Organization name is required'
    }),
  registration_number: Joi.string()
    .required()
    .messages({
      'any.required': 'Registration number is required'
    }),
  org_type: Joi.string()
    .valid('ngo', 'charity', 'trust', 'foundation', 'government', 'other')
    .required(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a 10-digit number',
      'any.required': 'Phone is required'
    }),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    geoLocation: geoLocationSchema
  }).required(),
  contactPerson: Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional()
  }).optional(),
  type_of_need: Joi.string()
    .valid('food', 'shelter', 'medical', 'basic_needs', 'education', 'employment', 'disaster_relief')
    .required(),
  urgency: Joi.string()
    .valid('low', 'medium', 'high', 'critical')
    .default('medium'),
  description: Joi.string()
    .min(50)
    .required()
    .messages({
      'string.min': 'Description must be at least 50 characters',
      'any.required': 'Description is required'
    })
});

module.exports = {
  registerIndividualSchema,
  registerOrganizationSchema
};
