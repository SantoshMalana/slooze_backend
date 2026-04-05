const { errorResponse } = require('../utils/response.utils');

/**
 * Authorize middleware — checks if logged-in user has one of the allowed roles.
 * Usage: authorize(['ADMIN', 'MANAGER'])
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized. Please log in.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

module.exports = authorize;
