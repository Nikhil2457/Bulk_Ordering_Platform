import React, { useState, useEffect } from 'react';
import axios from 'axios';
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


  // Fetch order history
  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/orders');
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  useEffect(() => {
    fetchOrderHistory(); // Fetch order history on page load
  }, []);

  useEffect(() => {
    // Fetch cart items when the component is mounted
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('https://bulk-ordering-platform.onrender.com/api/cart');
        setCartItems(response.data); // Set cart items in state
      } catch (error) {
        console.error('Error fetching cart items:', error);
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
    try {
      // Create order data, including all items in the cart
      const orderData = {
        ...order,
        items: cartItems.map((item) => ({
          productId: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
      };

      // Send order data to backend
      const response = await axios.post('https://bulk-ordering-platform.onrender.com/api/orders', orderData);
      console.log('Order successfully placed:', response.data);

      // Clear cart after placing the order (optional)
      await axios.delete('https://bulk-ordering-platform.onrender.com/api/cart');

      setIsConfirming(false); // Close confirmation modal

      // Optionally, clear the form after successful order submission
      setOrder({
        name: '',
        contact: '',
        address: '',
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleCancelOrder = () => {
    setIsConfirming(false); // Cancel order and close modal
  };

  return (
    <div className="order-form-container">
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
        </div>
      )}
      {/* Order History */}
      <div className="order-history-list">
        <h1>Order History</h1>
        {orderHistory.length > 0 ? (
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
              <h3>
  Total Amount: ₹{order.items.reduce((total, item) => total + item.totalPrice, 0)}
</h3>

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
