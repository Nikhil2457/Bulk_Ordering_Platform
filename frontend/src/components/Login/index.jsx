import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'https://bulk-ordering-platform.onrender.com/api/auth/login',
        { username, password },
        { withCredentials: true }
      );
      Cookies.set('token', res.data.token, { expires: 7 });
      toast.success('Login successful ✅');
      setTimeout(() => navigate('/'), 1500); // slight delay for toast visibility
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : 'Login'}
        </button>
        <p className="redirect-text">
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Login;
