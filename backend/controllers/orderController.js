const OrderItem=require('../models/OrderItem')
const Order = require('../models/Order');


let orderIdCounter = 1; // Simple counter for unique order IDs

exports.placeOrder = async (req, res) => {
  try {
    const { name, contact, address, items } = req.body;

    // Create Order
    const newOrder = await Order.create({
      id: orderIdCounter++,
      name,
      contact,
      address
    });

    // Create OrderItems
    const orderItems = items.map((item) => ({
      product_name: item.product_name,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      productId: item.productId,
      orderId: newOrder.id
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder.id });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Error placing order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
  
    try {
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      order.status = status;
      await order.save();
      res.status(200).json({ message: 'Status updated', order });
    } catch (error) {
      res.status(500).json({ error: 'Error updating order status' });
    }
  };
  
  // Get Order Status
  exports.getOrderStatus = async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      res.status(200).json({ status: order.status });
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving order status' });
    }
  };