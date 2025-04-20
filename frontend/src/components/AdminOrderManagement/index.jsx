import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'; // Style this as needed

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        console.error('Expected array, got:', res.data);
        setOrders([]); // Avoid map crash
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Fail safe
    }
  };
  

  const updateStatus = async (id, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Delivered';
    else return;

    await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: nextStatus });
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-orders-container">
      <h2>Order Management</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h4>Order ID: {order.id}</h4>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Contact:</strong> {order.contact}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <h5>Items:</h5>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>{item.product_name} - {item.quantity} × ₹{item.totalPrice}</li>
            ))}
          </ul>

          {order.status !== 'Delivered' && (
            <button onClick={() => updateStatus(order.id, order.status)}>
              Mark as {order.status === 'Pending' ? 'In Progress' : 'Delivered'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminOrderManagement;
