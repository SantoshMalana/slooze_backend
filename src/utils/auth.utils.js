const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * generateToken - Signs a JWT with an optional expiry.
 *
 * If JWT_EXPIRES_IN is set in .env (e.g. "7d"), the token will expire.
 * If JWT_EXPIRES_IN is NOT set, the token is signed WITHOUT an expiry
 * (never expires — useful for dev/testing, NOT recommended for production).
 *
 * WHY JWT_EXPIRES_IN=7d?
 *   - Security: If a token is stolen, it will stop working after 7 days
 *     instead of being valid forever. Always prefer expiry in production.
 *   - You can change it to "1d", "24h", "30d" etc. as per your use case.
 *   - To disable expiry entirely: just remove JWT_EXPIRES_IN from your .env
 */
const generateToken = (payload) => {
  const options = {};
  if (process.env.JWT_EXPIRES_IN) {
    options.expiresIn = process.env.JWT_EXPIRES_IN;
  }
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * generateTokenNoExpiry - Explicitly creates a token with NO expiration.
 * Use only for special cases like service-to-service auth or testing.
 */
const generateTokenNoExpiry = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

module.exports = {
  generateToken,
  generateTokenNoExpiry,
  verifyToken,
  hashPassword,
  comparePassword,
};
