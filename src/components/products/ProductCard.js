import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify({ productId: product._id });
      await axios.post('/api/cart', body, config);
      alert('Product added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg">
      <img className="w-full" src={product.image} alt={product.name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{product.name}</div>
        <p className="text-gray-700 text-base">{product.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          ₹{product.price}
        </span>
        <div className="flex flex-col space-y-2 mt-4">
          <Link
            to={`/products/${product._id}`}
            className="w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Details
          </Link>
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
