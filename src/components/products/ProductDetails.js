import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-center">
      <div className="md:w-1/2">
        <img src={product.image} alt={product.name} className="w-full" />
      </div>
      <div className="md:w-1/2 md:pl-8">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-700 text-xl mb-4">₹{product.price}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
