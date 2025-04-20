import React, { useState } from 'react';
import AdminOrderManagement from '../AdminOrderManagement';
import AdminProductManagement from '../AdminProductManagement';
import './index.css';

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogin = async () => {
    try {
      const res = await fetch('https://bulk-ordering-platform.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        setLoggedIn(true);
        setError('');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Try again.');
    }
  };

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  // ✅ Only shown after login
  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="tab-buttons">
        <button
          className={activeTab === 'orders' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'products' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'orders' ? <AdminOrderManagement /> : <AdminProductManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
