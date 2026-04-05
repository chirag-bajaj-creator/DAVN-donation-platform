const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const details = error.details.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          type: err.type
        }));

        return res.status(422).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details
        });
      }

      req.validatedData = value;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Validation middleware error',
        code: 'VALIDATION_MIDDLEWARE_ERROR',
        details: err.message
      });
    }
  };
};

module.exports = validate;
