const orderService = require('../services/order.service');
const { successResponse } = require('../utils/response.utils');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder({ ...req.body, user: req.user });
      return successResponse(res, 201, 'Order created successfully.', { order });
    } catch (error) {
      next(error);
    }
  }

  async placeOrder(req, res, next) {
    try {
      const order = await orderService.placeOrder(req.params.id, req.user);
      return successResponse(res, 200, 'Order placed successfully.', { order });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user);
      return successResponse(res, 200, 'Order cancelled successfully.', { order });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const orders = await orderService.getOrders(req.countryFilter);
      return successResponse(res, 200, 'Orders fetched successfully.', { orders });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user);
      return successResponse(res, 200, 'Order fetched successfully.', { order });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
