import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(res.data);
      } else {
        setCart({ items: [] }); // Clear cart if no token
      }
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error('Error fetching cart:', err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to the cart.');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const body = JSON.stringify({ productId, quantity });
      const res = await axios.post('/api/cart', body, config);
      setCart(res.data);
      alert('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err);
      alert('Failed to add item to cart.');
    }
  }, []);

  const updateCartItemQuantity = useCallback(async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to modify cart.');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const body = JSON.stringify({ productId, quantity });
      const res = await axios.post('/api/cart', body, config);
      setCart(res.data);
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
      alert('Failed to update cart item quantity.');
    }
  }, []);

  const removeCartItem = useCallback(async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to modify cart.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.delete(`/api/cart/${productId}`, config);
      setCart(res.data);
    } catch (err) {
      console.error('Error removing cart item:', err);
      alert('Failed to remove item from cart.');
    }
  }, []);

  const clearCart = useCallback(async () => {
    setCart({ items: [] }); // Optimistic update
    // In a real app, you might want to call a backend endpoint to clear the cart
  }, []);

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
