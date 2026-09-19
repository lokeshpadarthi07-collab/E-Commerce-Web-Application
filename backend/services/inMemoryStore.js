const bcrypt = require('bcryptjs');
const { seedProducts, seedDemoUser } = require('../utils/seedData');

// Initialize in-memory collections
let users = [];
let products = [];
let carts = {};
let orders = [];

let counter = 1000;
const generateId = () => (counter++).toString();

// Seed initial state
const initStore = async () => {
  if (products.length === 0) {
    products = seedProducts.map((p, index) => ({
      _id: (index + 1).toString(),
      ...p,
      reviews: [
        {
          _id: `rev_${index + 1}_1`,
          name: 'Sarah Jenkins',
          rating: 5,
          comment: 'Absolute top-notch quality! Fits description perfectly and arrived super fast.',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          _id: `rev_${index + 1}_2`,
          name: 'David K.',
          rating: 4,
          comment: 'Very solid build quality. Highly satisfied with my purchase.',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  if (users.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(seedDemoUser.password, salt);
    users.push({
      _id: 'user_demo_1',
      name: seedDemoUser.name,
      email: seedDemoUser.email.toLowerCase(),
      password: hashedPassword,
      role: 'admin', // Demo account gets admin access for testing admin dashboard!
      createdAt: new Date().toISOString()
    });
  }
};

initStore();

module.exports = {
  // User methods
  findUserByEmail: async (email) => {
    return users.find((u) => u.email === email.toLowerCase());
  },
  findUserById: async (id) => {
    const u = users.find((u) => u._id === id);
    if (!u) return null;
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  },
  createUser: async ({ name, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: generateId(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Product methods
  getProducts: async ({ category, brand, q, minPrice, maxPrice, sort }) => {
    let result = [...products];

    if (category && category !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand && brand !== 'All') {
      result = result.filter(
        (p) => p.brand && p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    if (q) {
      const term = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.brand && p.brand.toLowerCase().includes(term))
      );
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort) {
      if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') result.sort((a, b) => b.rating.rate - a.rating.rate);
      else if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  },

  getProductById: async (id) => {
    return products.find((p) => p._id === id) || null;
  },

  createProduct: async (productData) => {
    const newProduct = {
      _id: generateId(),
      rating: { rate: 5.0, count: 1 },
      reviews: [],
      stock: 15,
      isFeatured: false,
      isPopular: false,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    return newProduct;
  },

  deleteProduct: async (id) => {
    const index = products.findIndex((p) => p._id === id || p._id === String(id));
    if (index > -1) {
      products.splice(index, 1);
      return true;
    }
    return false;
  },

  addReview: async (productId, { name, rating, comment, userId }) => {
    const product = products.find((p) => p._id === productId);
    if (!product) throw new Error('Product not found');

    if (!product.reviews) product.reviews = [];
    const newReview = {
      _id: generateId(),
      name,
      rating: Number(rating),
      comment,
      user: userId,
      createdAt: new Date().toISOString()
    };
    product.reviews.unshift(newReview);

    // Recalculate average rating
    const totalRate = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = {
      rate: Number((totalRate / product.reviews.length).toFixed(1)),
      count: product.reviews.length
    };

    return product;
  },

  // Cart methods
  getCart: async (userId) => {
    if (!carts[userId]) {
      carts[userId] = [];
    }
    const cartItems = carts[userId].map((item) => {
      const product = products.find((p) => p._id === item.product._id || p._id === item.product);
      return {
        _id: item._id,
        product: product || item.product,
        quantity: item.quantity
      };
    });
    return { _id: `cart_${userId}`, user: userId, items: cartItems };
  },

  addToCart: async (userId, productId, quantity = 1) => {
    if (!carts[userId]) carts[userId] = [];
    const existingIndex = carts[userId].findIndex(
      (item) => (item.product._id || item.product) === productId
    );

    const productObj = products.find((p) => p._id === productId);
    if (!productObj) throw new Error('Product not found');

    if (existingIndex > -1) {
      carts[userId][existingIndex].quantity += Number(quantity);
    } else {
      carts[userId].push({
        _id: generateId(),
        product: productObj,
        quantity: Number(quantity)
      });
    }
    return module.exports.getCart(userId);
  },

  updateCartItem: async (userId, itemId, quantity) => {
    if (!carts[userId]) return module.exports.getCart(userId);

    const itemIndex = carts[userId].findIndex((item) => item._id === itemId || item.product._id === itemId || item.product === itemId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        carts[userId].splice(itemIndex, 1);
      } else {
        carts[userId][itemIndex].quantity = Number(quantity);
      }
    }
    return module.exports.getCart(userId);
  },

  removeFromCart: async (userId, itemId) => {
    if (!carts[userId]) return module.exports.getCart(userId);
    carts[userId] = carts[userId].filter((item) => item._id !== itemId && item.product._id !== itemId && item.product !== itemId);
    return module.exports.getCart(userId);
  },

  clearCart: async (userId) => {
    carts[userId] = [];
    return { _id: `cart_${userId}`, user: userId, items: [] };
  },

  // Order methods
  createOrder: async (userId, orderData) => {
    const newOrder = {
      _id: `ord_${generateId()}`,
      user: userId,
      orderItems: orderData.orderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'Credit Card / Debit Card',
      itemsPrice: orderData.itemsPrice,
      taxPrice: orderData.taxPrice,
      shippingPrice: orderData.shippingPrice,
      totalPrice: orderData.totalPrice,
      isPaid: true,
      paidAt: new Date().toISOString(),
      orderStatus: 'Processing',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    carts[userId] = [];
    return newOrder;
  },

  getUserOrders: async (userId) => {
    return orders.filter((o) => o.user === userId);
  },

  getOrderById: async (orderId) => {
    return orders.find((o) => o._id === orderId) || null;
  },

  // Admin Analytics Overview
  getAdminStats: async () => {
    const totalSales = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    return {
      totalSales,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders: orders.slice(0, 5)
    };
  }
};
