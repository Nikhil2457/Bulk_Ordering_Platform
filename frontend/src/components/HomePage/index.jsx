import React, { useEffect, useState } from 'react';
import { getProducts } from '../../utils/api';
import ProductCard from '../ProductCard';
import Header from '../Header';
import './index.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchProducts();
  }, []);

  return (
    <div className="homePage">
      <Header />
      <div className="intro">
        <h1>Welcome to the Bulk Ordering Platform</h1>
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
