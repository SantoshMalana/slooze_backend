const Restaurant = require('../models/restaurant.model');

class RestaurantRepository {
  async findAll(filter = {}) {
    return Restaurant.find(filter).exec();
  }

  async findById(id) {
    return Restaurant.findById(id).exec();
  }

  async create(data) {
    return Restaurant.create(data);
  }
}

module.exports = new RestaurantRepository();
