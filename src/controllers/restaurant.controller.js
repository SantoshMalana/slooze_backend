const restaurantService = require('../services/restaurant.service');
const { successResponse } = require('../utils/response.utils');

class RestaurantController {
  async getAll(req, res, next) {
    try {
      const restaurants = await restaurantService.getAll(req.countryFilter);
      return successResponse(res, 200, 'Restaurants fetched successfully.', { restaurants });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const restaurant = await restaurantService.getById(req.params.id, req.user);
      return successResponse(res, 200, 'Restaurant fetched successfully.', { restaurant });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RestaurantController();
