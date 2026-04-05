const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/restaurants', require('./restaurant.routes'));
router.use('/orders', require('./order.routes'));
router.use('/payments', require('./payment.routes'));

module.exports = router;
