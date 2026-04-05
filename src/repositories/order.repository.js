const Order = require('../models/order.model');

class OrderRepository {
  async create(data) {
    return Order.create(data);
  }

  async findById(id) {
    return Order.findById(id).populate('userId', 'name email role country').exec();
  }

  async findAll(filter = {}) {
    return Order.find(filter).populate('userId', 'name email role country').exec();
  }

  async updateById(id, updateData) {
    return Order.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}

module.exports = new OrderRepository();
