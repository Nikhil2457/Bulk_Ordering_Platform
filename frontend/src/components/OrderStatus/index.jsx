import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../Header"
import './index.css';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/orders/user',{withCredentials:true});
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // auto-refresh every 5s
    console.log("api call requested")
    return () => clearInterval(intervalId); // cleanup
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return <h1 className='no-order'>No Order to Track. Please Order Now!</h1>;
  }
  

  return (
    <div className="status-container">
      <Header/>
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
