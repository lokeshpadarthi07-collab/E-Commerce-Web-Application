const Product = require('../models/Product');
const { isFallbackMode } = require('../config/db');
const inMemoryStore = require('../services/inMemoryStore');

// @desc    Get all products with filtering, search & sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, brand, q, minPrice, maxPrice, sort } = req.query;

    if (isFallbackMode()) {
      const products = await inMemoryStore.getProducts({ category, brand, q, minPrice, maxPrice, sort });
      return res.json({
        success: true,
        count: products.length,
        data: products
      });
    }

    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (brand && brand !== 'All') {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption['rating.rate'] = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const products = await Product.find(query).sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isFallbackMode()) {
      const product = await inMemoryStore.getProductById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock, brand, isFeatured, isPopular } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ success: false, message: 'Please provide all required product fields' });
    }

    if (isFallbackMode()) {
      const product = await inMemoryStore.createProduct({
        name, description, price: Number(price), category, image, stock: Number(stock) || 15, brand, isFeatured, isPopular
      });
      return res.status(201).json({ success: true, data: product });
    }

    const product = await Product.create({
      name, description, price, category, image, stock: stock || 15, brand, isFeatured, isPopular
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide both rating and comment' });
    }

    if (isFallbackMode()) {
      const product = await inMemoryStore.addReview(id, {
        name: req.user.name,
        rating: Number(rating),
        comment,
        userId: req.user._id
      });
      return res.status(201).json({ success: true, data: product });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    product.reviews.unshift(review);
    product.rating.count = product.reviews.length;
    product.rating.rate =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get store dashboard stats for admin
// @route   GET /api/products/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    if (isFallbackMode()) {
      const stats = await inMemoryStore.getAdminStats();
      return res.json({ success: true, data: stats });
    }

    const Order = require('../models/Order');
    const User = require('../models/User');

    const orders = await Order.find();
    const totalSales = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalOrders = orders.length;
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isFallbackMode()) {
      await inMemoryStore.deleteProduct(id);
      return res.json({ success: true, message: 'Product removed' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  createProductReview,
  getAdminStats
};
