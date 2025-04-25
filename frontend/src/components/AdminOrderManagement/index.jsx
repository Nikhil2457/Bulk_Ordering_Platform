import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ import toast
import './index.css';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/orders');
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (Array.isArray(res.data)) {
        setOrders(sorted);
        toast.success('Orders fetched successfully');
      } else {
        console.error('Expected array, got:', res.data);
        setOrders([]);
        toast.error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      toast.error('Failed to fetch orders');
    }
  };

  const updateStatus = async (id, currentStatus) => {
    try {
      let nextStatus = '';
      if (currentStatus === 'Pending') nextStatus = 'In Progress';
      else if (currentStatus === 'In Progress') nextStatus = 'Delivered';
      else return;

      await axios.put(`https://bulk-ordering-platform.onrender.com/api/orders/${id}/status`, { status: nextStatus });
      toast.success(`Order marked as ${nextStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
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
          <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
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
