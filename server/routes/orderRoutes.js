const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id, // Map _id to product for reference
        _id: undefined, // Remove _id from item to avoid Mongoose _id conflicts
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'CashOnDelivery' ? false : true, // Set to false for COD, true for others
      paidAt: paymentMethod === 'CashOnDelivery' ? null : Date.now(),
      paymentResult: paymentMethod === 'CashOnDelivery' ? {} : { status: 'succeeded' }, // Placeholder
    });

    try {
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'username email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

module.exports = router;
