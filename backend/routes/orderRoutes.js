const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  getOrderStatus
} = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, placeOrder); // user places order
router.get('/user', authMiddleware, getUserOrders); // get orders for logged-in user
router.get('/', getAllOrders); // admin only (optional: protect with isAdmin)
router.put('/:id/status', updateOrderStatus);
router.get('/:id/status', getOrderStatus);

module.exports = router;
