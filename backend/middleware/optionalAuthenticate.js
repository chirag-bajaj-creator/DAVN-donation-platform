const jwt = require('jsonwebtoken');

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
  } catch (error) {
    // Keep this middleware optional; protected routes should use authenticate.
  }

  return next();
};

module.exports = optionalAuthenticate;
