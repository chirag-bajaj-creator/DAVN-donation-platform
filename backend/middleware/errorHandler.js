const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();

  console.error('[ERROR]', {
    timestamp,
    message: err.message,
    code: err.code,
    path: req.path,
    method: req.method
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.keys(err.errors).map(key => ({
      field: key,
      message: err.errors[key].message
    }));

    return res.status(422).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details,
      timestamp
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(422).json({
      success: false,
      error: `${field} already exists`,
      code: 'DUPLICATE_ENTRY',
      field,
      timestamp
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
      timestamp
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token has expired',
      code: 'TOKEN_EXPIRED',
      timestamp
    });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code || 'ERROR',
      timestamp
    });
  }

  // Default error
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    timestamp,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
