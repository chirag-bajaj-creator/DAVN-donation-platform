const Joi = require('joi');

const generateQRSchema = Joi.object({
  donation_id: Joi.string()
    .required()
    .messages({
      'any.required': 'Donation ID is required'
    })
});

const updatePaymentStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'completed', 'expired')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, completed, expired',
      'any.required': 'Status is required'
    }),
  transactionId: Joi.string()
    .optional(),
  amount: Joi.number()
    .optional()
});

module.exports = {
  generateQRSchema,
  updatePaymentStatusSchema
};
