const orderRepository = require('../repositories/order.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const paymentRepository = require('../repositories/payment.repository');
const { ORDER_STATUS } = require('../constants');
const { assertSameCountry } = require('../middlewares/countryAccess.middleware');

class OrderService {
  async createOrder({ restaurantId, items, user }) {
    // Fetch restaurant & validate country access
    const restaurant = await restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      const error = new Error('Restaurant not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!assertSameCountry(restaurant, user)) {
      const error = new Error('Access denied. You can only order from restaurants in your country.');
      error.statusCode = 403;
      throw error;
    }

    // Validate menu items and compute total
    const menuMap = new Map(restaurant.menuItems.map((item) => [item._id.toString(), item]));
    let totalAmount = 0;
    const resolvedItems = [];

    for (const { menuItemId, quantity } of items) {
      const menuItem = menuMap.get(menuItemId);
      if (!menuItem) {
        const error = new Error(`Menu item ${menuItemId} not found in this restaurant.`);
        error.statusCode = 400;
        throw error;
      }
      if (!menuItem.isAvailable) {
        const error = new Error(`Menu item "${menuItem.name}" is currently unavailable.`);
        error.statusCode = 400;
        throw error;
      }
      const itemTotal = menuItem.price * quantity;
      totalAmount += itemTotal;
      resolvedItems.push({
        menuItemId: menuItem._id,
        menuItemName: menuItem.name,
        quantity,
        price: menuItem.price,
      });
    }

    const order = await orderRepository.create({
      userId: user._id,
      restaurantId,
      items: resolvedItems,
      totalAmount,
      status: ORDER_STATUS.CREATED,
      country: user.country,
    });

    return order;
  }

  async placeOrder(orderId, user) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!assertSameCountry(order, user)) {
      const error = new Error('Access denied. You can only manage orders in your country.');
      error.statusCode = 403;
      throw error;
    }

    if (order.status !== ORDER_STATUS.CREATED) {
      const error = new Error(`Order cannot be placed. Current status: ${order.status}`);
      error.statusCode = 400;
      throw error;
    }

    // Fetch default payment method for placing order
    const payments = await paymentRepository.findByUserId(user._id);
    const defaultPayment = payments.find((p) => p.isDefault) || payments[0];
    if (!defaultPayment) {
      const error = new Error('No payment method found. Please add a payment method first.');
      error.statusCode = 400;
      throw error;
    }

    const updated = await orderRepository.updateById(orderId, {
      status: ORDER_STATUS.PLACED,
      paymentId: defaultPayment._id,
    });

    return updated;
  }

  async cancelOrder(orderId, user) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!assertSameCountry(order, user)) {
      const error = new Error('Access denied. You can only manage orders in your country.');
      error.statusCode = 403;
      throw error;
    }

    if (order.status === ORDER_STATUS.CANCELLED) {
      const error = new Error('Order is already cancelled.');
      error.statusCode = 400;
      throw error;
    }

    if (order.status === ORDER_STATUS.PLACED) {
      const error = new Error('Placed orders cannot be cancelled. Contact support.');
      error.statusCode = 400;
      throw error;
    }

    const updated = await orderRepository.updateById(orderId, {
      status: ORDER_STATUS.CANCELLED,
    });

    return updated;
  }

  async getOrders(countryFilter) {
    return orderRepository.findAll(countryFilter);
  }

  async getOrderById(orderId, user) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!assertSameCountry(order, user)) {
      const error = new Error('Access denied. You can only view orders in your country.');
      error.statusCode = 403;
      throw error;
    }

    return order;
  }
}

module.exports = new OrderService();
