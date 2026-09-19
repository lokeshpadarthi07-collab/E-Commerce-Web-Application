import api from './api';

export const cartService = {
  getCart: async () => {
    return await api.get('/cart');
  },

  addToCart: async (productId, quantity = 1) => {
    return await api.post('/cart', { productId, quantity });
  },

  updateCartItem: async (itemId, quantity) => {
    return await api.put(`/cart/${itemId}`, { quantity });
  },

  removeFromCart: async (itemId) => {
    return await api.delete(`/cart/${itemId}`);
  }
};
