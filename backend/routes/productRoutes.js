const express = require('express');
const router = express.Router();
const  Product  = require('../models/Product'); // Make sure Product model is imported

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll(); // Fetch all products
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// POST /api/products - Add a new product
router.post('/', async (req, res) => {
  const { name, price, unit, image } = req.body;
  try {
    const newProduct = await Product.create({ name, price, unit, image });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.destroy({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, unit, image } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name;
    product.price = price;
    product.unit = unit;
    product.image = image;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

module.exports = router;
