import React from 'react';
import axios from 'axios';

const Checkout = () => {
  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        '/api/checkout',
        {},
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'), // Assuming token is stored in localStorage
          },
        }
      );
      window.location.href = res.data.url; // Redirect to Stripe checkout page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
          <h1 className="text-2xl mb-4">Checkout</h1>
          <p className="mb-4">Click the button below to proceed to checkout.</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
