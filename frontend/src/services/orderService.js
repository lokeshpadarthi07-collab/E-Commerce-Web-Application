import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  getUserOrders: async () => {
    return await api.get('/orders');
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  }
};
