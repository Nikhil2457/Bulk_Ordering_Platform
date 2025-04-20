const express = require('express');
const router = express.Router();
const { placeOrder, getAllOrders ,updateOrderStatus,getOrderStatus} = require('../controllers/orderController');

router.post('/', placeOrder);       // POST /api/orders
router.get('/', getAllOrders);      // GET  /api/orders

router.put('/:id/status', updateOrderStatus);
router.get('/:id/status', getOrderStatus);

    
module.exports = router;
