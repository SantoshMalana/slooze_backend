const { verifyToken } = require('../utils/auth.utils');
const { errorResponse } = require('../utils/response.utils');
const userRepository = require('../repositories/user.repository');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'Invalid token. User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token has expired.');
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token.');
    }
    return errorResponse(res, 500, 'Authentication failed.');
  }
};

module.exports = authenticate;
