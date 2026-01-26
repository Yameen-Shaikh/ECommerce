import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartItem from './CartItem';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', {
        headers: {
          'x-auth-token': localStorage.getItem('token'), // Assuming token is stored in localStorage
        },
      });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="flex flex-col">
          {cart.items.map((item) => (
            <CartItem key={item.product._id} item={item} refreshCart={fetchCart} />
          ))}
          <div className="flex justify-end mt-5">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
