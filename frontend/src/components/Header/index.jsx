import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import {
  FaBars, FaTimes, FaShoppingCart, FaHome,
  FaClipboardList, FaUserShield, FaSignOutAlt, FaTruck
} from 'react-icons/fa';
import './index.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      Cookies.remove('token');
      toast.success('Logged out successfully');
      navigate('/login');
    } else {
      toast.info('Logout cancelled');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Bulk<span>Order</span></h1>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="navList">
          <li><Link to="/" onClick={toggleMenu}><FaHome /> Home</Link></li>
          <li><Link to="/cart" onClick={toggleMenu}><FaShoppingCart /> Cart</Link></li>
          <li><Link to="/order" onClick={toggleMenu}><FaClipboardList /> Place Order</Link></li>
          <li><Link to="/track-order" onClick={toggleMenu}><FaTruck /> Track Order</Link></li>
          <li><Link to="/admin" onClick={toggleMenu}><FaUserShield /> Admin</Link></li>
          <li>
            <button className="logoutBtn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
