const Cart = require('../models/Cart');
const Product = require('../models/Product');


exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if item with same productId already exists in cart
    const existingItem = await Cart.findOne({ where: { productId } });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const newTotal = newQuantity * product.price;

      const updatedItem = await existingItem.update({
        quantity: newQuantity,
        totalPrice: newTotal,
      });

      return res.status(200).json(updatedItem); // Returns updated cart item with unique Cart.id
    }

    // Create a new cart item (new Cart.id is generated)
    const newItem = await Cart.create({
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
    const items = await Cart.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.destroy({ where: {} });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });

    await item.destroy();
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
};
