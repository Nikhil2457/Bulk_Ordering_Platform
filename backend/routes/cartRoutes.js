const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  clearCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity
} = require('../controllers/cartController');

const {authMiddleware} = require('../middleware/authMiddleware');

router.use(authMiddleware); // All cart routes need authentication

router.post('/', addToCart);
router.get('/', getCart);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

// New routes for quantity updates
router.patch('/:id/increment', incrementQuantity);
router.patch('/:id/decrement', decrementQuantity);

module.exports = router;
