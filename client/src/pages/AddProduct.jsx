import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DOMAINS = ['farming', 'fishing', 'pottery', 'dairy'];

export default function AddProduct() {
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', domain: 'farming' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);

      await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400 }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="stock" type="number" placeholder="Stock quantity" value={form.stock} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <select name="domain" value={form.domain} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'block', marginBottom: '0.5rem' }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
