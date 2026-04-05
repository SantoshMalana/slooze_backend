const Payment = require('../models/payment.model');

class PaymentRepository {
  async create(data) {
    return Payment.create(data);
  }

  async findByUserId(userId) {
    return Payment.find({ userId }).exec();
  }

  async findById(id) {
    return Payment.findById(id).exec();
  }

  async updateById(id, updateData) {
    return Payment.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async upsertDefault(userId, updateData) {
    return Payment.findOneAndUpdate(
      { userId },
      { ...updateData, userId },
      { new: true, upsert: true }
    ).exec();
  }
}

module.exports = new PaymentRepository();
