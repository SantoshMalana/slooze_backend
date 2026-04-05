const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { ROLES } = require('../constants');

const { ADMIN } = ROLES;

// GET payment methods — authenticated user sees their own
router.get(
  '/',
  authenticate,
  paymentController.getPaymentMethods.bind(paymentController)
);

// POST add payment method — ADMIN only
router.post(
  '/',
  authenticate,
  authorize([ADMIN]),
  paymentController.addPaymentMethod.bind(paymentController)
);

// PUT update payment method — ADMIN only
router.put(
  '/update',
  authenticate,
  authorize([ADMIN]),
  paymentController.updatePaymentMethod.bind(paymentController)
);

module.exports = router;
