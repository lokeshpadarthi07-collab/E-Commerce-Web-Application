const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { isFallbackMode } = require('../config/db');
const inMemoryStore = require('../services/inMemoryStore');

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (isFallbackMode()) {
      const cart = await inMemoryStore.getCart(userId);
      return res.json({ success: true, data: cart });
    }

    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide a productId' });
    }

    if (isFallbackMode()) {
      const cart = await inMemoryStore.addToCart(userId, productId, quantity);
      return res.json({ success: true, data: cart });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid non-negative quantity' });
    }

    if (isFallbackMode()) {
      const cart = await inMemoryStore.updateCartItem(userId, itemId, quantity);
      return res.json({ success: true, data: cart });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId || item.product.toString() === itemId
    );

    if (itemIndex > -1) {
      if (Number(quantity) === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
    }

    cart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: itemId } = req.params;

    if (isFallbackMode()) {
      const cart = await inMemoryStore.removeFromCart(userId, itemId);
      return res.json({ success: true, data: cart });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId && item.product.toString() !== itemId
    );

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
