const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
          code: 'UNAUTHORIZED'
        });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to access this resource',
          code: 'FORBIDDEN',
          requiredRole: allowedRoles,
          userRole: req.user.role
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Authorization error',
        code: 'AUTH_ERROR',
        details: err.message
      });
    }
  };
};

module.exports = authorize;
