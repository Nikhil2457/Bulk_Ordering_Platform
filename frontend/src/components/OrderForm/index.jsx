import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import './index.css';

const OrderForm = () => {
  const [order, setOrder] = useState({
    name: '',
    contact: '',
    address: '',
  });

  const [cartItems, setCartItems] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);


  // Fetch order history
  const fetchOrderHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/orders/user', { withCredentials: true });
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };
  

  useEffect(() => {
    fetchOrderHistory(); // Fetch order history on page load
  }, []);

  useEffect(() => {
    // Fetch cart items when the component is mounted
    const fetchCartItems = async () => {
      setCartLoading(true);
      try {
        const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setCartLoading(false);
      }
    };
    

    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirming(true); // Show confirmation modal
  };

  const handleConfirmOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderData = {
        ...order,
        items: cartItems.map((item) => ({
          productId: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
      };
  
      const response = await axios.post('https://bulk-ordering-platform.onrender.com/api/orders', orderData, { withCredentials: true });
      console.log(response.data)
      await axios.delete('https://bulk-ordering-platform.onrender.com/api/cart', { withCredentials: true });
  
      setOrder({ name: '', contact: '', address: '' });
      setIsConfirming(false);
      fetchOrderHistory(); // Refresh history after placing order
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setPlacingOrder(false);
    }
  };
  
  const handleCancelOrder = () => {
    setIsConfirming(false); // Cancel order and close modal
  };

  return (
    <div className="order-form-container">
      <Header/>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Place Your Order</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={order.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={order.contact}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={order.address}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Order</button>
      </form>
      {/* Confirmation Modal */}
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

      {/* Order History */}
      <div className="order-history-list">
        <h1>Order History</h1>
        {historyLoading ?(
           <div className="spinner-container"><div className="spinner"></div></div>
        ):orderHistory.length > 0 ? (
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
