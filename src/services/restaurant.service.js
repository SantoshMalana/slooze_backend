const restaurantRepository = require('../repositories/restaurant.repository');
const { assertSameCountry } = require('../middlewares/countryAccess.middleware');

class RestaurantService {
  async getAll(countryFilter) {
    return restaurantRepository.findAll(countryFilter);
  }

  async getById(id, user) {
    const restaurant = await restaurantRepository.findById(id);
    if (!restaurant) {
      const error = new Error('Restaurant not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!assertSameCountry(restaurant, user)) {
      const error = new Error('Access denied. You can only view restaurants in your country.');
      error.statusCode = 403;
      throw error;
    }

    return restaurant;
  }
}

module.exports = new RestaurantService();
