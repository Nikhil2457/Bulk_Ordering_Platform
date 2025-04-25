import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmModal from '../ConfirmModal'; // ✅ Import confirmation modal
import './index.css';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', unit: '', image: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ✅ For tracking which product to delete

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/products');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit) return toast.error('Fill all required fields');
    try {
      await axios.post('https://bulk-ordering-platform.onrender.com/api/products', form);
      setForm({ name: '', price: '', unit: '', image: '' });
      toast.success('Product added');
      fetchProducts();
    } catch {
      toast.error('Failed to add product');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://bulk-ordering-platform.onrender.com/api/products/${confirmDeleteId}`);
      toast.success('Product deleted');
      setConfirmDeleteId(null); // ✅ Close modal
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (id) => {
    const product = products.find(p => p.id === id);
    if (product) setForm(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.id) return;
    try {
      await axios.put(`https://bulk-ordering-platform.onrender.com/api/products/${form.id}`, form);
      toast.success('Product updated');
      setForm({ name: '', price: '', unit: '', image: '' });
      fetchProducts();
    } catch {
      toast.error('Update failed');
    }
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
            <button onClick={() => setConfirmDeleteId(p.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* ✅ Confirmation Modal */}
      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
};

export default AdminProductManagement;
