import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  if (isChecking) return null;

  return children;
};

export default ProtectedRoute;
