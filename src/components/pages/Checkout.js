import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery'); // Default to Cash on Delivery

  const { address, city, postalCode, country } = shippingAddress;

  const onChange = (e) =>
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Please log in to proceed with checkout.');
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      navigate('/');
      return;
    }

    if (!address || !city || !postalCode || !country) {
      alert('Please fill in all shipping address fields.');
      return;
    }

    try {
      const orderItems = cart.items.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product, // Product ID from cart item
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal, // Assuming cartTotal is items price for simplicity
        taxPrice: 0, // For now, assume 0 tax
        shippingPrice: 0, // For now, assume 0 shipping
        totalPrice: cartTotal, // For now, total price is cart total
      };

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post('/api/orders', orderData, config);

      if (res.data) {
        clearCart();
        navigate('/ordersuccess', { state: { orderId: res.data._id } }); // Pass orderId to the new order success page
      }
    } catch (err) {
      console.error('Checkout error:', err.response ? err.response.data : err);
      alert('Checkout failed. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {cart.items.length === 0 ? (
          <p className="text-center text-lg">Your cart is empty. Please add items to proceed.</p>
        ) : (
          <>
            {/* Cart Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              {cart.items.map((item) => (
                <div key={item.product} className="flex justify-between items-center border-b py-2">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 text-xl font-bold">
                <span>Total:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="address"
                    type="text"
                    placeholder="123 Main St"
                    name="address"
                    value={address}
                    onChange={onChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                    City
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="city"
                    type="text"
                    placeholder="New York"
                    name="city"
                    value={city}
                    onChange={onChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="postalCode"
                    type="text"
                    placeholder="10001"
                    name="postalCode"
                    value={postalCode}
                    onChange={onChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                    Country
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="country"
                    type="text"
                    placeholder="USA"
                    name="country"
                    value={country}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  checked={paymentMethod === 'CashOnDelivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="cashOnDelivery" className="text-lg text-gray-700">Cash on Delivery</label>
              </div>
              {/* Add other payment methods here if needed, e.g., Stripe, PayPal */}
            </div>

            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCheckout}
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
