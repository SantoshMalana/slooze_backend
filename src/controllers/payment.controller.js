const paymentService = require('../services/payment.service');
const { successResponse } = require('../utils/response.utils');

class PaymentController {
  async getPaymentMethods(req, res, next) {
    try {
      const payments = await paymentService.getPaymentMethods(req.user._id);
      return successResponse(res, 200, 'Payment methods fetched.', { payments });
    } catch (error) {
      next(error);
    }
  }

  async addPaymentMethod(req, res, next) {
    try {
      const payment = await paymentService.addPaymentMethod(req.user._id, req.body);
      return successResponse(res, 201, 'Payment method added.', { payment });
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentMethod(req, res, next) {
    try {
      const payment = await paymentService.updatePaymentMethod(req.user._id, req.body);
      return successResponse(res, 200, 'Payment method updated.', { payment });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
