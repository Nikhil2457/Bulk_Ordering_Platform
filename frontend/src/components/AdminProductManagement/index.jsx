import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'; // Style as needed

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', unit: '', image: '' });

  const fetchProducts = async () => {
    const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/products');
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit) return;
    await axios.post('https://bulk-ordering-platform.onrender.com/api/products', form);
    setForm({ name: '', price: '', unit: '', image: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bulk-ordering-platform.onrender.com/api/products/${id}`);
    fetchProducts();
  };

  const handleEdit = async (id) => {
    const product = products.find(p => p.id === id);
    setForm(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.id) return;
    await axios.put(`https://bulk-ordering-platform.onrender.com/api/products/${form.id}`, form);
    setForm({ name: '', price: '', unit: '', image: '' });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-product-container">
      <h2>Product Management</h2>

      <form onSubmit={form.id ? handleUpdate : handleAddProduct}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input type="text" name="unit" placeholder="Unit (e.g., kg/dozen)" value={form.unit} onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} />
        <button type="submit">{form.id ? 'Update' : 'Add'} Product</button>
      </form>

      <div className="product-list">
        {products.map((p) => (
          <div key={p.id} className="product-item">
            <h4>{p.name}</h4>
            <p>₹{p.price} / {p.unit}</p>
            {p.image && <img src={p.image} alt={p.name} />}
            <button onClick={() => handleEdit(p.id)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductManagement;
