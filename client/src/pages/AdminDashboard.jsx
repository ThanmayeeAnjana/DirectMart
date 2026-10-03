import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../pages/Seller.css';

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
        err.response?.data?.message ||
          'Failed to load sellers'
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
    return (
      <main className="seller-page">
        <div className="seller-container">
          <div className="seller-loading">
            <div className="seller-loading-icon">
              🛡️
            </div>

            <h2>Loading admin dashboard</h2>

            <p>
              Please wait while we fetch seller accounts.
            </p>

            <div className="seller-spinner"></div>
          </div>
        </div>
      </main>
    );
  }

  const approvedCount = sellers.filter(
    (seller) => seller.approved
  ).length;

  const pendingCount = sellers.filter(
    (seller) => !seller.approved
  ).length;

  return (
    <main className="seller-page">
      <div className="seller-container">

        <header className="seller-header">
          <div>
            <span className="seller-eyebrow">
              ADMIN CENTER
            </span>

            <h1>Admin Dashboard</h1>

            <p>
              Review seller accounts and manage marketplace
              access.
            </p>
          </div>

          <div className="seller-order-count">
            <strong>{sellers.length}</strong>
            <span>
              {sellers.length === 1
                ? 'Seller'
                : 'Sellers'}
            </span>
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
              👥
            </div>

            <div>
              <span>Total Sellers</span>
              <strong>{sellers.length}</strong>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              ✓
            </div>

            <div>
              <span>Approved</span>
              <strong className="seller-approved">
                {approvedCount}
              </strong>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {pendingCount}
              </strong>
            </div>
          </div>
        </section>

        <section className="seller-card">

          <div className="seller-card-header">
            <div>
              <span className="seller-card-eyebrow">
                SELLER MANAGEMENT
              </span>

              <h2>Seller Accounts</h2>

              <p>
                Review and manage seller approval status.
              </p>
            </div>
          </div>

          {sellers.length === 0 ? (
            <div className="seller-orders-empty">
              <div className="seller-orders-empty-icon">
                👥
              </div>

              <span className="seller-eyebrow">
                NO SELLERS
              </span>

              <h2>No sellers found</h2>

              <p>
                Seller accounts will appear here when users
                register as sellers.
              </p>
            </div>
          ) : (
            <div className="admin-seller-list">
              {sellers.map((seller) => (
                <article
                  className="admin-seller-card"
                  key={seller._id}
                >

                  <div className="admin-seller-avatar">
                    {seller.name
                      ? seller.name
                          .charAt(0)
                          .toUpperCase()
                      : 'S'}
                  </div>

                  <div className="admin-seller-info">
                    <div className="admin-seller-name-row">
                      <h3>{seller.name}</h3>

                      <span
                        className={
                          seller.approved
                            ? 'admin-status admin-status-approved'
                            : 'admin-status admin-status-pending'
                        }
                      >
                        <span></span>

                        {seller.approved
                          ? 'Approved'
                          : 'Pending'}
                      </span>
                    </div>

                    <p className="admin-seller-email">
                      {seller.email}
                    </p>

                    <div className="admin-seller-details">
                      <div>
                        <span>Address</span>

                        <strong>
                          {seller.address ||
                            'Not provided'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="admin-seller-action">
                    {seller.approved ? (
                      <button
                        className="admin-unapprove-button"
                        onClick={() =>
                          handleApproval(
                            seller._id,
                            false
                          )
                        }
                        disabled={
                          updatingId === seller._id
                        }
                      >
                        {updatingId === seller._id
                          ? 'Updating...'
                          : 'Unapprove Seller'}
                      </button>
                    ) : (
                      <button
                        className="admin-approve-button"
                        onClick={() =>
                          handleApproval(
                            seller._id,
                            true
                          )
                        }
                        disabled={
                          updatingId === seller._id
                        }
                      >
                        {updatingId === seller._id
                          ? 'Updating...'
                          : 'Approve Seller'}
                      </button>
                    )}
                  </div>

                </article>
              ))}
            </div>
          )}

        </section>

        <div className="seller-help-card">
          <span>💡</span>

          <div>
            <strong>Admin note</strong>

            <p>
              Review seller information before approving
              marketplace access.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}