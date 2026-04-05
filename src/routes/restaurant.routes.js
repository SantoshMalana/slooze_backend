const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const { restrictCountryAccess } = require('../middlewares/countryAccess.middleware');

// All roles can view — but country-scoped
router.get('/', authenticate, restrictCountryAccess, restaurantController.getAll.bind(restaurantController));
router.get('/:id', authenticate, restrictCountryAccess, restaurantController.getById.bind(restaurantController));

module.exports = router;
