import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartCard from '../CartCard';
import Header from '../Header';
import { toast } from 'react-toastify'; // ✅ toast import
import './index.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });
      setCartItems(response.data);
      toast.success('Cart items loaded');
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await axios.delete('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });
      toast.success('Cart cleared successfully');
      fetchCartItems();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`https://bulk-ordering-platform.onrender.com/api/cart/${id}`, { withCredentials: true });
      toast.success('Item removed');
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      setLoading(false);
    }
  };

  const handleIncrement = async (id) => {
    try {
      setLoading(true);
      await axios.put(`https://bulk-ordering-platform.onrender.com/api/cart/${id}/increment`, {}, { withCredentials: true });
      toast.success('Quantity increased');
      fetchCartItems();
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      toast.error('Failed to increase quantity');
      setLoading(false);
    }
  };

  const handleDecrement = async (id) => {
    try {
      setLoading(true);
      await axios.put(`https://bulk-ordering-platform.onrender.com/api/cart/${id}/decrement`, {}, { withCredentials: true });
      toast.success('Quantity decreased');
      fetchCartItems();
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      toast.error('Failed to decrease quantity');
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <div className="cart-page">
      <Header />
      <h1 className="cart-title">Your Cart</h1>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default CartPage;
