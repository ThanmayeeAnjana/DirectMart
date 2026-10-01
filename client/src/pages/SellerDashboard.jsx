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

        // Get the latest user information from the server
        const userResponse = await api.get('/auth/me');
        const currentUser = userResponse.data;

        setUser(currentUser);

        // Update localStorage with the latest user data
        localStorage.setItem(
          'user',
          JSON.stringify(currentUser)
        );

        // Load seller's products
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
      <div className="seller-page">
        <div className="seller-container">
          <div className="seller-card">
            <h2>Seller Dashboard</h2>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="seller-page">
        <div className="seller-container">
          <div className="seller-card">
            <h2>Seller Dashboard</h2>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Seller is not approved
  if (user && user.approved !== true) {
    return (
      <div className="seller-page">
        <div className="seller-container">
          <div className="seller-card empty-state">
            <h2>Seller Dashboard</h2>

            <h3>⏳ Waiting for Admin Approval</h3>

            <p>
              Your seller account has been created successfully.
            </p>

            <p>
              An administrator needs to approve your seller
              account before you can add or manage products.
            </p>

            <p>
              Please check back after your account has been
              approved.
            </p>

            <div className="approval-status">
              <strong>Status: Pending Approval</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approved seller
  return (
    <div className="seller-page">
      <div className="seller-container">

        <div className="seller-header">
          <div>
            <h2>Seller Dashboard</h2>
            <p>Manage your products and orders</p>
          </div>

          <div className="seller-actions">
            <Link
              to="/seller/add-product"
              className="seller-button seller-button-primary"
            >
              + Add Product
            </Link>

            <Link
              to="/seller/orders"
              className="seller-button seller-button-secondary"
            >
              View Orders
            </Link>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="seller-card">

          {products.length === 0 ? (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Add your first product to start selling.</p>

              <Link
                to="/seller/add-product"
                className="seller-button seller-button-primary"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Name</th>
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
                      {product.name}
                    </td>

                    <td>₹{product.price}</td>

                    <td>{product.stock}</td>

                    <td>{product.domain}</td>

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
          )}

        </div>
      </div>
    </div>
  );
}