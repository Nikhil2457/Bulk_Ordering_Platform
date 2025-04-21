const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId; // Extracted from JWT middleware

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if this user already has the product in their cart
    const existingItem = await Cart.findOne({ where: { productId, userId } });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const newTotal = newQuantity * product.price;

      const updatedItem = await existingItem.update({
        quantity: newQuantity,
        totalPrice: newTotal,
      });

      return res.status(200).json(updatedItem);
    }

    // Create a new cart item for this user
    const newItem = await Cart.create({
      userId,
      productId,
      name: product.name,
      image: product.image,
      unit: product.unit,
      price: product.price,
      quantity,
      totalPrice: quantity * product.price,
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const items = await Cart.findAll({ where: { userId } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    await Cart.destroy({ where: { userId } });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const item = await Cart.findOne({ where: { id, userId } });

    if (!item) return res.status(404).json({ error: 'Item not found in cart' });

    await item.destroy();
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

exports.incrementQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const item = await Cart.findOne({ where: { id, userId } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const newQuantity = item.quantity + 1;
    const newTotal = newQuantity * item.price;

    await item.update({
      quantity: newQuantity,
      totalPrice: newTotal,
    });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to increment quantity' });
  }
};

exports.decrementQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const item = await Cart.findOne({ where: { id, userId } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.quantity <= 1) {
      return res.status(400).json({ message: 'Minimum quantity is 1' });
    }

    const newQuantity = item.quantity - 1;
    const newTotal = newQuantity * item.price;

    await item.update({
      quantity: newQuantity,
      totalPrice: newTotal,
    });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to decrement quantity' });
  }
};
