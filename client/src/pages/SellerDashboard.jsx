import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Seller.css';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const userResponse = await api.get('/auth/me');
        const currentUser = userResponse.data;

        setUser(currentUser);

        localStorage.setItem(
          'user',
          JSON.stringify(currentUser)
        );

        const productsResponse = await api.get(
          '/products/seller/mine'
        );

        setProducts(productsResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load seller dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      setError('');

      await api.delete(`/products/${id}`);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== id
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to delete product'
      );
    }
  };

  if (loading) {
    return (
      <main className="seller-page">
        <div className="seller-container">
          <div className="seller-loading">
            <div className="seller-loading-icon">
              🏪
            </div>

            <h2>Loading your dashboard</h2>
            <p>Please wait while we fetch your products.</p>

            <div className="seller-spinner"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="seller-page">
        <div className="seller-container">
          <div className="seller-card seller-error-card">
            <div className="seller-status-icon">!</div>
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (user && user.approved !== true) {
    return (
      <main className="seller-page">
        <div className="seller-container">
          <div className="seller-pending-card">
            <div className="pending-icon">
              ⏳
            </div>

            <span className="seller-eyebrow">
              SELLER ACCOUNT
            </span>

            <h1>Waiting for Admin Approval</h1>

            <p>
              Your seller account has been created
              successfully.
            </p>

            <p>
              An administrator needs to approve your
              seller account before you can add or manage
              products.
            </p>

            <div className="approval-status">
              <span className="approval-dot"></span>
              <strong>Pending Approval</strong>
            </div>

            <p className="pending-note">
              Please check back after your account has
              been approved.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  return (
    <main className="seller-page">
      <div className="seller-container">

        <header className="seller-header">
          <div>
            <span className="seller-eyebrow">
              SELLER CENTER
            </span>

            <h1>
              Welcome, {user?.name || 'Seller'}
            </h1>

            <p>
              Manage your products and keep your
              marketplace inventory up to date.
            </p>
          </div>

          <div className="seller-actions">
            <Link
              to="/seller/add-product"
              className="seller-button seller-button-primary"
            >
              <span>＋</span>
              Add Product
            </Link>

            <Link
              to="/seller/orders"
              className="seller-button seller-button-secondary"
            >
              View Orders
              <span>→</span>
            </Link>
          </div>
        </header>

        {error && (
          <div className="seller-error-banner">
            <span>!</span>
            {error}
          </div>
        )}

        <section className="seller-stats">
          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              📦
            </div>

            <div>
              <span>Total Products</span>
              <strong>{totalProducts}</strong>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              📊
            </div>

            <div>
              <span>Total Stock</span>
              <strong>{totalStock}</strong>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              ✓
            </div>

            <div>
              <span>Account Status</span>
              <strong className="seller-approved">
                Approved
              </strong>
            </div>
          </div>
        </section>

        <section className="seller-card">
          <div className="seller-card-header">
            <div>
              <span className="seller-card-eyebrow">
                INVENTORY
              </span>

              <h2>Your Products</h2>

              <p>
                Products currently listed on DirectMart.
              </p>
            </div>

            <Link
              to="/seller/add-product"
              className="seller-small-button"
            >
              + Add Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                📦
              </div>

              <h3>No products yet</h3>

              <p>
                Add your first product to start selling
                directly to customers.
              </p>

              <Link
                to="/seller/add-product"
                className="seller-button seller-button-primary"
              >
                Add Your First Product
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="seller-table-wrapper">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Domain</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="product-name">
                        <div className="product-cell">
                          <div className="product-icon">
                            🛍️
                          </div>

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <small>
                              ID: {product._id.slice(-6)}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="product-price">
                        ₹{product.price}
                      </td>

                      <td>
                        <span
                          className={
                            Number(product.stock) === 0
                              ? 'stock-badge stock-empty'
                              : Number(product.stock) <= 5
                              ? 'stock-badge stock-low'
                              : 'stock-badge stock-good'
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td>
                        <span className="domain-badge">
                          {product.domain}
                        </span>
                      </td>

                      <td>
                        <button
                          className="seller-button seller-button-danger"
                          onClick={() =>
                            handleDelete(product._id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="seller-help-card">
          <span>💡</span>

          <div>
            <strong>Seller tip</strong>

            <p>
              Keep your product stock updated so customers
              always see accurate availability.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}