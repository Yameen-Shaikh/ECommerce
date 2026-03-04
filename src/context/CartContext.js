import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/api/cart');
      setCart(res.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error('Error fetching cart:', err);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, isAuthenticated]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      if (!isAuthenticated || !token) {
        alert('Please log in to add items to the cart.');
        navigate('/login');
        return;
      }

      const body = { productId, quantity };
      const res = await api.post('/api/cart', body);
      setCart(res.data);
      alert('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err);
      alert('Failed to add item to cart.');
    }
  }, [isAuthenticated, token, navigate]);

  const updateCartItemQuantity = useCallback(async (productId, quantity) => {
    try {
      if (!isAuthenticated || !token) {
        alert('Please log in to modify cart.');
        return;
      }

      const body = { productId, quantity };
      const res = await api.post('/api/cart', body);
      setCart(res.data);
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
      alert('Failed to update cart item quantity.');
    }
  }, [isAuthenticated, token]);

  const removeCartItem = useCallback(async (productId) => {
    try {
      if (!isAuthenticated || !token) {
        alert('Please log in to modify cart.');
        return;
      }

      const res = await api.delete(`/api/cart/${productId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Error removing cart item:', err);
      alert('Failed to remove item from cart.');
    }
  }, [isAuthenticated, token]);

  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated && token) {
        await api.delete('/api/cart');
      }
      setCart({ items: [] });
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  }, [isAuthenticated, token]);

  const cartTotal = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartItemCount = cart.items.reduce((acc, item) => acc + item.qty, 0);


  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartItemCount,
        loading,
        error,
        fetchCart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
