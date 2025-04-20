import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/orders');
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // auto-refresh every 5s
    console.log("api call requested")
    return () => clearInterval(intervalId); // cleanup
  }, []);

  if (orders.length === 0) {
    return <p>No Order to Track</p>;
  }

  return (
    <div className="status-container">
      <h2>Order Status</h2>
      {orders.map((order) => (
        <div key={order.id} className="status-item">
          <p><strong>ID:</strong> {order.id}</p>
          <p className={`status-text status-${order.status.toLowerCase().replace(' ', '-')}`}>
            {order.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
