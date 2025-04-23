// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

import HomePage from './components/HomePage'; 
import OrderForm from './components/OrderForm';
import OrderStatus from './components/OrderStatus';
import AdminDashboard from './components/AdminDashboard';
import CartPage from './components/CartPage';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute'; 
import './App.css'; 

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><OrderForm /></ProtectedRoute>} />
        <Route path="/track-order" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
