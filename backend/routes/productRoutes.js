const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  createProductReview,
  getAdminStats
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/admin/stats', protect, admin, getAdminStats);

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct);

router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
