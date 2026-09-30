import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadSellers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/admin/sellers');
      setSellers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load sellers'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleApproval = async (sellerId, approved) => {
    try {
      setUpdatingId(sellerId);
      setError('');

      const response = await api.put(
        `/admin/sellers/${sellerId}/approval`,
        { approved }
      );

      setSellers((currentSellers) =>
        currentSellers.map((seller) =>
          seller._id === sellerId
            ? response.data.seller
            : seller
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to update seller approval'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div style={{ padding: '30px' }}>Loading sellers...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h2>Admin Dashboard</h2>

      <p>
        Manage seller approval from this page.
      </p>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {sellers.length === 0 ? (
        <p>No sellers found.</p>
      ) : (
        <div>
          {sellers.map((seller) => (
            <div
              key={seller._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
              }}
            >
              <h3>{seller.name}</h3>

              <p>
                <strong>Email:</strong> {seller.email}
              </p>

              <p>
                <strong>Address:</strong>{' '}
                {seller.address || 'Not provided'}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {seller.approved ? 'Approved' : 'Pending'}
              </p>

              {seller.approved ? (
                <button
                  onClick={() =>
                    handleApproval(seller._id, false)
                  }
                  disabled={updatingId === seller._id}
                >
                  {updatingId === seller._id
                    ? 'Updating...'
                    : 'Unapprove Seller'}
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleApproval(seller._id, true)
                  }
                  disabled={updatingId === seller._id}
                >
                  {updatingId === seller._id
                    ? 'Updating...'
                    : 'Approve Seller'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}