const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { restrictCountryAccess } = require('../middlewares/countryAccess.middleware');
const { ROLES } = require('../constants');

const { ADMIN, MANAGER, MEMBER } = ROLES;

// GET all orders (country-scoped)
router.get(
  '/',
  authenticate,
  restrictCountryAccess,
  orderController.getOrders.bind(orderController)
);

// GET single order
router.get(
  '/:id',
  authenticate,
  restrictCountryAccess,
  orderController.getOrderById.bind(orderController)
);

// POST create order — ALL roles
router.post(
  '/',
  authenticate,
  restrictCountryAccess,
  orderController.createOrder.bind(orderController)
);

// POST place order — ADMIN & MANAGER only
router.post(
  '/:id/place',
  authenticate,
  authorize([ADMIN, MANAGER]),
  restrictCountryAccess,
  orderController.placeOrder.bind(orderController)
);

// DELETE cancel order — ADMIN & MANAGER only
router.delete(
  '/:id/cancel',
  authenticate,
  authorize([ADMIN, MANAGER]),
  restrictCountryAccess,
  orderController.cancelOrder.bind(orderController)
);

module.exports = router;
