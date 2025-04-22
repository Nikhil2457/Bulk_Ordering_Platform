import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartCard from '../CartCard';
import Header from '../Header';
import './index.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
   
  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleClearCart = async () => {
    try {
      await axios.delete('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });
      fetchCartItems();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`https://bulk-ordering-platform.onrender.com/api/cart/${id}`, { withCredentials: true });
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleIncrement = async (id) => {
    try {
      await axios.patch(`https://bulk-ordering-platform.onrender.com/api/cart/${id}/increment`, {}, { withCredentials: true });
      fetchCartItems();
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const handleDecrement = async (id) => {
    try {
      await axios.patch(`https://bulk-ordering-platform.onrender.com/api/cart/${id}/decrement`, {}, { withCredentials: true });
      fetchCartItems();
    } catch (error) {
      console.error('Error decrementing quantity:', error);
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
            <CartCard
              key={item.id}
              cart={item}
              onRemove={() => handleRemove(item.id)}
              onIncrement={() => handleIncrement(item.id)}
              onDecrement={() => handleDecrement(item.id)}
            />
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
