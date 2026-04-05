const { body, validationResult } = require('express-validator');
const { ROLES, COUNTRIES } = require('../constants');
const { errorResponse } = require('../utils/response.utils');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }
  next();
};

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
  body('country')
    .notEmpty()
    .isIn(Object.values(COUNTRIES))
    .withMessage(`Country must be one of: ${Object.values(COUNTRIES).join(', ')}`),
  handleValidationErrors,
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

module.exports = { registerValidator, loginValidator };
