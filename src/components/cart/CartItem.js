import React from 'react';

const CartItem = ({ item, updateCartItemQuantity, removeCartItem }) => { // Destructure new props
  const handleUpdateQuantity = (newQuantity) => {
    updateCartItemQuantity(item.product, newQuantity); // Call context function
  };

  const handleRemoveItem = () => {
    removeCartItem(item.product); // Call context function
  };

  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mr-4" />
      <div className="flex-1">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
        <p className="text-gray-600">Quantity: {item.qty}</p>
      </div>
      <div className="flex items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          onClick={() => handleUpdateQuantity(item.qty - 1)}
          disabled={item.qty === 1}
        >
          -
        </button>
        <span className="mx-2">{item.qty}</span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          onClick={() => handleUpdateQuantity(item.qty + 1)}
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
