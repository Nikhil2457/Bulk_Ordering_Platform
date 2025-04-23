import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import { toast } from 'react-toastify';
import './index.css';

const OrderForm = () => {
  const [order, setOrder] = useState({ name: '', contact: '', address: '' });
  const [cartItems, setCartItems] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchOrderHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/orders/user', { withCredentials: true });
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      toast.error('❌ Failed to load order history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      setCartLoading(true);
      try {
        const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('❌ Failed to load cart');
      } finally {
        setCartLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.totalPrice, 0);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  const handleConfirmOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderData = {
        ...order,
        items: cartItems.map(item => ({
          productId: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
      };

      await axios.post('https://bulk-ordering-platform.onrender.com/api/orders', orderData, { withCredentials: true });
      await axios.delete('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });

      setOrder({ name: '', contact: '', address: '' });
      setIsConfirming(false);
      fetchOrderHistory();
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('❌ Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };  

  const handleCancelOrder = () => {
    setIsConfirming(false);
  };

  return (
    <div className="order-form-container">
      <Header />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Place Your Order</h2>
        <input type="text" name="name" placeholder="Name" value={order.name} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact" value={order.contact} onChange={handleChange} required />
        <textarea name="address" placeholder="Delivery Address" value={order.address} onChange={handleChange} required />
        <button type="submit">Submit Order</button>
      </form>

      {isConfirming && (
        <div className="confirmation-modal">
          <h3>Are you sure you want to place the order?</h3>
          {placingOrder ? (
            <div className="spinner-container"><div className="spinner"></div></div>
          ) : (
            <>
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id}>
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total: ₹{item.totalPrice}</p>
                  </li>
                ))}
              </ul>
              <h3>Total Amount: ₹{calculateTotal()}</h3>
              <button onClick={handleConfirmOrder}>Confirm</button>
              <button onClick={handleCancelOrder}>Cancel</button>
            </>
          )}
        </div>
      )}

      <div className="order-history-list">
        <h1>Order History</h1>
        {historyLoading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : orderHistory.length > 0 ? (
          orderHistory.map((order) => (
            <div key={order.id} className="order-card">
              <h4>{order.name}</h4>
              <p>Contact: {order.contact}</p>
              <p>Address: {order.address}</p>
              <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.product_name}</strong> — Qty: {item.quantity}, ₹{item.totalPrice}
                  </li>
                ))}
              </ul>
              <h3>Total Amount: ₹{order.items.reduce((total, item) => total + item.totalPrice, 0)}</h3>
            </div>
          ))
        ) : (
          <p className="empty-msg">No history of orders</p>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
