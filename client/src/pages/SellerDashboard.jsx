import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Seller.css';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products/seller/mine').then((res) => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

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
                {products.map((p) => (
                  <tr key={p._id}>
                    <td className="product-name">{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.domain}</td>
                    <td>
                      <button
                        className="seller-button seller-button-danger"
                        onClick={() => handleDelete(p._id)}
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