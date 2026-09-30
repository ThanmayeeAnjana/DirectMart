import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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
      <div style={{ padding: '2rem' }}>
        <h2>Seller Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Seller Dashboard</h2>

        <p style={{ color: 'red' }}>
          {error}
        </p>
      </div>
    );
  }

  // Seller is not approved
  if (user && user.approved !== true) {
    return (
      <div
        style={{
          maxWidth: '700px',
          margin: '50px auto',
          padding: '30px',
          textAlign: 'center',
          border: '1px solid #ddd',
          borderRadius: '10px',
        }}
      >
        <h2>Seller Dashboard</h2>

        <h3 style={{ marginTop: '30px' }}>
          ⏳ Waiting for Admin Approval
        </h3>

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

        <div
          style={{
            marginTop: '25px',
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <strong>
            Status: Pending Approval
          </strong>
        </div>
      </div>
    );
  }

  // Approved seller
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Seller Dashboard</h2>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <Link to="/seller/add-product">
          + Add Product
        </Link>

        <Link
          to="/seller/orders"
          style={{ marginLeft: '1rem' }}
        >
          View Orders
        </Link>
      </div>

      {products.length === 0 ? (
        <p>
          You haven't added any products yet.
        </p>
      ) : (
        <table
          style={{
            width: '100%',
            marginTop: '1rem',
            borderCollapse: 'collapse',
          }}
        >
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
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.domain}</td>

                <td>
                  <button
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
  );
}