const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { isFallbackMode } = require('../config/db');
const inMemoryStore = require('../services/inMemoryStore');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Please provide complete shipping address details' });
    }

    if (isFallbackMode()) {
      const order = await inMemoryStore.createOrder(userId, {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });
      return res.status(201).json({ success: true, data: order });
    }

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card / Debit Card',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: 'Processing'
    });

    const createdOrder = await order.save();

    // Clear user cart upon successful order
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (isFallbackMode()) {
      const orders = await inMemoryStore.getUserOrders(userId);
      return res.json({ success: true, data: orders });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isFallbackMode()) {
      const order = await inMemoryStore.getOrderById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }

    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure users can only access their own orders unless admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};
