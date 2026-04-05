const { ROLES } = require('../constants');
const { errorResponse } = require('../utils/response.utils');

/**
 * restrictCountryAccess middleware (BONUS)
 *
 * - ADMIN: bypasses country restriction (can see all countries)
 * - MANAGER / MEMBER: can only access resources matching their country
 *
 * Attaches `req.countryFilter` to be used in service/repository queries.
 */
const restrictCountryAccess = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Unauthorized. Please log in.');
  }

  if (req.user.role === ROLES.ADMIN) {
    // Admin sees everything — no country filter
    req.countryFilter = {};
  } else {
    // Manager & Member are scoped to their country
    req.countryFilter = { country: req.user.country };
  }

  next();
};

/**
 * Validates that a specific resource belongs to the user's country.
 * Used after fetching a resource, to block cross-country access.
 */
const assertSameCountry = (resource, user) => {
  if (user.role === ROLES.ADMIN) return true; // Admin bypasses
  return resource.country === user.country;
};

module.exports = { restrictCountryAccess, assertSameCountry };
