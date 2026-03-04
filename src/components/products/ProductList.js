import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        console.log('API Response Data:', res.data); // Debugging: See what the API actually returns
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error('API did not return an array:', res.data);
          setProducts([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p className="text-center col-span-full py-10">No products found or error loading data.</p>
      )}
    </div>
  );
};

export default ProductList;
