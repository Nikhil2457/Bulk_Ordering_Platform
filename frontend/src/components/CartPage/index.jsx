import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartCard from '../CartCard';
import Header from '../Header';
import './index.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleClearCart = async () => {
    try {
      await axios.delete('https://bulk-ordering-platform.onrender.com/api/cart'); // Calls clearCart
      fetchCartItems(); // Refresh UI
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`https://bulk-ordering-platform.onrender.com/api/cart/${id}`);
      fetchCartItems(); // Refresh after deletion
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <div className="cart-page">
      <Header />
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-list">
        {cartItems.length > 0 ? (
          cartItems.map(item => (
            <CartCard key={item.id} cart={item} onRemove={() => handleRemove(item.id)} />
          ))
        ) : (
          <p className="empty-msg">Your cart is empty.</p>
        )}
      </div>

      {cartItems.length > 0 && (
  <>
    <div className="total-box">
      <h3>Total Amount: ₹{calculateTotal()}</h3>
    </div>

    <div className="clear-cart-box">
      <button className="clear-cart-btn" onClick={handleClearCart}>
        Remove All Products
      </button>
    </div>
  </>
)}

    </div>
  );
};

export default CartPage;
