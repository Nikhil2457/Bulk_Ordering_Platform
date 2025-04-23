import React from 'react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './index.css';

const ProductCard = ({ product }) => {
  const { id, image, name, price, unit } = product;

  const handleAddToCart = async () => {
    try {
      await axios.post(
        'https://bulk-ordering-platform.onrender.com/api/cart',
        { productId: id, quantity: 1 },
        { withCredentials: true }
      );
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Error adding to cart', err);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-unit">{unit}</p>
        <p className="product-price">₹{price}</p>
        <button className="addbtn" onClick={handleAddToCart}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
