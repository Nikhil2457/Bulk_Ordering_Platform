const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  clearCart,
  removeFromCart
} = require('../controllers/cartController');

router.post('/', addToCart);
router.get('/', getCart);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);


module.exports = router;
