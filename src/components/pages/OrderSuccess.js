import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Confetti from 'react-confetti';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000); // Stop confetti after 10 seconds

    return () => clearTimeout(confettiTimer);
  }, [orderId]);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500 text-lg">{error}</div>;
  }

  if (!order) {
    return <div className="text-center mt-10 text-red-500 text-lg">Order not found.</div>;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} gravity={0.05} />}
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl w-full relative z-10">
        <svg
          className="mx-auto h-20 w-20 text-green-500 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mt-6">Order Placed Successfully!</h1>
        <p className="text-gray-600 mt-3 text-lg">Thank you for your purchase, {user ? user.username : 'customer'}!</p>
        <p className="text-gray-600">Your order <span className="font-semibold">#{order._id}</span> will be processed shortly.</p>

        <div className="mt-8 text-left border-t border-b py-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          {order.orderItems.map((item) => (
            <div key={item.product} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-gray-700">{item.name} x {item.qty}</span>
              <span className="font-medium text-gray-900">₹{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 text-xl font-bold text-gray-800">
            <span>Total:</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
          <p className="text-gray-700">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <p className="text-gray-700">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Continue Shopping
          </Link>
          <Link
            to="/myorders" // Assuming you'll have a route for "My Orders"
            className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Go to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
