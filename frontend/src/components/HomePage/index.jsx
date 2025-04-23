import React, { useEffect, useState } from 'react';
import { getProducts, getUsername} from '../../utils/api';
import ProductCard from '../ProductCard';
import Header from '../Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productData, usernameData] = await Promise.all([
          getProducts(),
          getUsername(),
        ]);
        setProducts(productData);
        setUsername(usernameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="homePage">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <div className="intro">
        <h1>Welcome {username ? `${username}` : ''} 👋</h1>
        <h1>to the Bulk Ordering Platform</h1>
        <p>Browse our wide range of fresh fruits and vegetables for bulk ordering.</p>
      </div>
      
      <div className="productList">
  {loading ? (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  ) : (
    products.length > 0 ? (
      products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))
    ) : (
      <p>No products available.</p>
    )
  )}
</div>

    </div>
  );
};

export default HomePage;
