import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('aurashop_guest_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Promo Coupon Code state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 10, type: 'percent', label: '10% Discount' });
      showSuccess('Coupon WELCOME10 applied! 10% off.');
      return true;
    } else if (cleanCode === 'AURA500') {
      setAppliedCoupon({ code: 'AURA500', discount: 500, type: 'flat', label: '₹500 Discount' });
      showSuccess('Coupon AURA500 applied! ₹500 off.');
      return true;
    } else if (cleanCode === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', discount: 0, type: 'freeship', label: 'Free Shipping' });
      showSuccess('Coupon FREESHIP applied! Free Shipping granted.');
      return true;
    } else {
      showError('Invalid coupon code. Try "WELCOME10" or "AURA500"');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showInfo('Coupon code removed');
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.data && res.data.items) {
        setCartItems(res.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      localStorage.setItem('aurashop_guest_cart', JSON.stringify(cartItems));
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('aurashop_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);
    if (isAuthenticated) {
      try {
        const productId = product._id || product.id;
        const res = await cartService.addToCart(productId, qty);
        setCartItems(res.data.items);
        showSuccess(`Added "${product.name}" to cart!`);
      } catch (error) {
        showError(error.message || 'Failed to add item to cart');
      }
    } else {
      setCartItems((prev) => {
        const productId = product._id || product.id;
        const existingIndex = prev.findIndex(
          (item) => (item.product._id || item.product.id) === productId
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += qty;
          return updated;
        } else {
          return [
            ...prev,
            {
              _id: `guest_${Date.now()}`,
              product,
              quantity: qty
            }
          ];
        }
      });
      showSuccess(`Added "${product.name}" to cart!`);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const newQty = Number(quantity);
    if (isAuthenticated) {
      try {
        const res = await cartService.updateCartItem(itemId, newQty);
        setCartItems(res.data.items);
      } catch (error) {
        showError(error.message || 'Failed to update item quantity');
      }
    } else {
      setCartItems((prev) => {
        if (newQty <= 0) {
          return prev.filter(
            (item) =>
              item._id !== itemId &&
              (item.product._id || item.product.id) !== itemId
          );
        }
        return prev.map((item) => {
          if (
            item._id === itemId ||
            (item.product._id || item.product.id) === itemId
          ) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
      });
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.removeFromCart(itemId);
        setCartItems(res.data.items);
        showSuccess('Item removed from cart');
      } catch (error) {
        showError(error.message || 'Failed to remove item');
      }
    } else {
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            item._id !== itemId &&
            (item.product._id || item.product.id) !== itemId
        )
      );
      showSuccess('Item removed from cart');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    if (!isAuthenticated) {
      localStorage.removeItem('aurashop_guest_cart');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Calculate Coupon Discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = subtotal * (appliedCoupon.discount / 100);
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(subtotal, appliedCoupon.discount);
    }
  }

  const tax = (subtotal - discountAmount) * 0.08;
  let shipping = subtotal > 1000 || subtotal === 0 || appliedCoupon?.type === 'freeship' ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + tax + shipping);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        tax,
        shipping,
        total,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
