const paymentRepository = require('../repositories/payment.repository');

class PaymentService {
  async getPaymentMethods(userId) {
    return paymentRepository.findByUserId(userId);
  }

  async updatePaymentMethod(userId, { method, details, isDefault }) {
    // If setting as default, we upsert user's payment
    const payment = await paymentRepository.upsertDefault(userId, {
      method,
      details,
      isDefault: isDefault !== undefined ? isDefault : true,
    });
    return payment;
  }

  async addPaymentMethod(userId, { method, details, isDefault }) {
    const payment = await paymentRepository.create({
      userId,
      method,
      details,
      isDefault: isDefault || false,
    });
    return payment;
  }
}

module.exports = new PaymentService();
