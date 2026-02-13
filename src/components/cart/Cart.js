import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import { useCart } from '../../context/CartContext'; // Import useCart

const Cart = () => {
  const { cart, cartTotal, fetchCart, updateCartItemQuantity, removeCartItem } = useCart(); // Use CartContext
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart(); // Fetch cart when component mounts
  }, [fetchCart]); // Depend on fetchCart

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="flex flex-col">
          {cart.items.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
              updateCartItemQuantity={updateCartItemQuantity} // Pass from context
              removeCartItem={removeCartItem} // Pass from context
            />
          ))}
          <div className="flex justify-end mt-5">
            <h2 className="text-2xl font-bold mr-4">Total: ₹{cartTotal.toFixed(2)}</h2>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
