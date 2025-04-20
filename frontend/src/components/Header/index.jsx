import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    alert('Logged out successfully');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Bulk Order</h1>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="navList">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/cart" onClick={toggleMenu}>Cart</Link></li>
          <li><Link to="/order" onClick={toggleMenu}>Place Order</Link></li>
          <li><Link to="/track-order" onClick={toggleMenu}>Track Order</Link></li>
          <li><Link to="/admin" onClick={toggleMenu}>Admin</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
