const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const staticProducts = require('../data/products'); // Static product data

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      res.json(cart);
    } else {
      res.json({ user: req.user._id, items: [] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    // Find product details from static data
    const product = staticProducts.find(p => p._id === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (cart) {
      // Cart exists for user
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        let productItem = cart.items[itemIndex];
        productItem.qty = quantity; // Update to the new quantity
        cart.items[itemIndex] = productItem;
      } else {
        // Product does not exist in cart, add new item
        cart.items.push({
          product: productId,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: quantity,
        });
      }
      cart = await cart.save();
      return res.status(200).json(cart);
    } else {
      // No cart for user, create a new cart
      const newCart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            name: product.name,
            image: product.image,
            price: product.price,
            qty: quantity,
          },
        ],
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  const productId = req.params.id;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
      cart = await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
