import React from 'react';
import axios from 'axios';

const CartItem = ({ item, refreshCart }) => {
  const handleUpdateQuantity = async (newQuantity) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify({ productId: item.product._id, quantity: newQuantity });
      await axios.post('/api/cart', body, config);
      refreshCart();
    } catch (err) {
      console.error(err);
      alert('Failed to update quantity.');
    }
  };

  const handleRemoveItem = async () => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      await axios.delete(`/api/cart/${item.product._id}`, config);
      refreshCart();
    } catch (err) {
      console.error(err);
      alert('Failed to remove item.');
    }
  };

  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover mr-4" />
      <div className="flex-1">
        <h3 className="text-lg font-bold">{item.product.name}</h3>
        <p className="text-gray-600">${item.product.price}</p>
        <p className="text-gray-600">Quantity: {item.quantity}</p>
      </div>
      <div className="flex items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity === 1}
        >
          -
        </button>
        <span className="mx-2">{item.quantity}</span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
        >
          +
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm ml-4"
          onClick={handleRemoveItem}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
