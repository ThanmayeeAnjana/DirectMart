import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Seller.css';

const DOMAINS = ['farming', 'fishing', 'pottery', 'dairy'];

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    domain: 'farming',
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append('image', image);
      }

      await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/seller/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to add product'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="seller-page">
      <div className="seller-form-card">

        <h2>Add Product</h2>
        <p>Add a new product to your marketplace.</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Product Name</label>
            <input
              className="form-input"
              name="name"
              placeholder="Enter product name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              className="form-input"
              name="price"
              type="number"
              placeholder="Enter price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              className="form-input"
              name="stock"
              type="number"
              placeholder="Enter stock quantity"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-textarea"
              name="description"
              placeholder="Describe your product"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Domain</label>

            <select
              className="form-select"
              name="domain"
              value={form.domain}
              onChange={handleChange}
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product Image</label>

            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            className="seller-button seller-button-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Uploading...' : 'Add Product'}
          </button>

        </form>
      </div>
    </div>
  );
}