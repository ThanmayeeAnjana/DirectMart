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
        err.response?.data?.message ||
          'Failed to add product'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="seller-page">
      <div className="seller-form-container">

        <div className="seller-form-heading">
          <span className="seller-eyebrow">
            SELLER CENTER
          </span>

          <h1>Add New Product</h1>

          <p>
            Add a product to your DirectMart marketplace
            and start reaching customers.
          </p>
        </div>

        <div className="seller-form-card">

          <div className="seller-form-card-header">
            <div className="seller-form-icon">
              📦
            </div>

            <div>
              <h2>Product Information</h2>
              <p>
                Enter the details of the product you want
                to sell.
              </p>
            </div>
          </div>

          {error && (
            <div className="seller-error-banner">
              <span>!</span>
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="seller-product-form"
          >

            <div className="seller-form-grid">

              <div className="seller-form-group">
                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  className="form-input"
                  name="name"
                  placeholder="e.g. Fresh Mangoes"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="seller-form-group">
                <label htmlFor="domain">
                  Domain
                </label>

                <select
                  id="domain"
                  className="form-select"
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="seller-form-group">
                <label htmlFor="price">
                  Price (₹)
                </label>

                <input
                  id="price"
                  className="form-input"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="seller-form-group">
                <label htmlFor="stock">
                  Stock Quantity
                </label>

                <input
                  id="stock"
                  className="form-input"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Enter available quantity"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="seller-form-group">
              <label htmlFor="description">
                Product Description
              </label>

              <textarea
                id="description"
                className="form-textarea"
                name="description"
                placeholder="Describe your product, its quality, origin, or any details customers should know..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="seller-form-group">
              <label htmlFor="image">
                Product Image
              </label>

              <div className="seller-file-wrapper">
                <input
                  id="image"
                  className="seller-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files[0])
                  }
                />

                <div className="seller-file-content">
                  <span className="seller-file-icon">
                    🖼️
                  </span>

                  <div>
                    <strong>
                      {image
                        ? image.name
                        : 'Choose a product image'}
                    </strong>

                    <small>
                      {image
                        ? 'Image selected successfully'
                        : 'PNG, JPG or other image formats'}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="seller-form-footer">
              <button
                type="button"
                className="seller-button seller-button-secondary"
                onClick={() =>
                  navigate('/seller/dashboard')
                }
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                className="seller-button seller-button-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Uploading...'
                  : 'Add Product'}
                {!submitting && <span>→</span>}
              </button>
            </div>

          </form>
        </div>

        <div className="seller-form-note">
          <span>💡</span>

          <p>
            Make sure your product information is
            accurate before adding it to the marketplace.
          </p>
        </div>

      </div>
    </main>
  );
}