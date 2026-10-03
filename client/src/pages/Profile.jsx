import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [approved, setApproved] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showChangePassword, setShowChangePassword] =
    useState(false);
  const [currentPassword, setCurrentPassword] =
    useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [changingPassword, setChangingPassword] =
    useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/auth/me');

        setName(response.data.name || '');
        setEmail(response.data.email || '');
        setAddress(response.data.address || '');
        setApproved(response.data.approved || false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load profile'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        '/auth/profile',
        {
          name: name.trim(),
          address: address.trim(),
        }
      );

      const updatedUser = response.data.user;
      const currentToken =
        localStorage.getItem('token');

      if (currentToken) {
        login(currentToken, {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          address: updatedUser.address,
          approved: updatedUser.approved,
        });
      }

      setName(updatedUser.name);
      setAddress(updatedUser.address || '');
      setApproved(updatedUser.approved || false);

      setMessage(
        'Profile updated successfully!'
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        'Please fill in all password fields'
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        'New password must be at least 6 characters long'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        'New password must be different from current password'
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.put(
        '/auth/change-password',
        {
          currentPassword,
          newPassword,
        }
      );

      setMessage(
        response.data.message ||
          'Password changed successfully!'
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to change password'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const closePasswordForm = () => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setError('');
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-message">
          <div className="profile-loading-icon">
            👤
          </div>

          <h2>Loading your profile</h2>

          <p>
            Please wait while we fetch your account
            information.
          </p>

          <div className="profile-spinner"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        <header className="profile-header">
          <div className="profile-avatar">
            {name
              ? name.charAt(0).toUpperCase()
              : 'U'}
          </div>

          <div className="profile-header-text">
            <span className="profile-eyebrow">
              YOUR ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information and
              account security.
            </p>
          </div>
        </header>

        {(message || error) && (
          <div
            className={
              message
                ? 'profile-alert profile-success'
                : 'profile-alert profile-error'
            }
          >
            <span>
              {message ? '✓' : '!'}
            </span>

            <p>{message || error}</p>
          </div>
        )}

        <div className="profile-layout">

          {/* PERSONAL INFORMATION */}
          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <span className="profile-card-eyebrow">
                  PERSONAL INFORMATION
                </span>

                <h2>Account Details</h2>
              </div>

              <div className="profile-card-icon">
                👤
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="profile-form"
            >
              <div className="profile-form-group">
                <label htmlFor="profile-name">
                  Full Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-email">
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  disabled
                />

                <span className="profile-field-note">
                  Your email address cannot be changed here.
                </span>
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-address">
                  Delivery Address
                </label>

                <textarea
                  id="profile-address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Enter your delivery address"
                  rows="4"
                />
              </div>

              {user?.role === 'seller' && (
                <div className="seller-approval">
                  <div className="seller-approval-icon">
                    {approved ? '✓' : '⏳'}
                  </div>

                  <div>
                    <span>
                      Seller approval status
                    </span>

                    <strong
                      className={
                        approved
                          ? 'approved'
                          : 'pending'
                      }
                    >
                      {approved
                        ? 'Approved'
                        : 'Pending approval'}
                    </strong>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="profile-primary-button"
              >
                {saving
                  ? 'Saving changes...'
                  : 'Save Changes'}

                {!saving && <span>→</span>}
              </button>
            </form>
          </section>

          {/* SECURITY */}
          <section className="profile-card security-card">
            <div className="profile-card-header">
              <div>
                <span className="profile-card-eyebrow">
                  ACCOUNT SECURITY
                </span>

                <h2>Password</h2>
              </div>

              <div className="profile-card-icon">
                🔒
              </div>
            </div>

            <p className="security-description">
              Keep your account secure by using a strong
              password and updating it regularly.
            </p>

            {!showChangePassword ? (
              <div className="security-closed">
                <div className="security-status">
                  <span>✓</span>

                  <div>
                    <strong>
                      Password protected
                    </strong>

                    <small>
                      Your account password is securely
                      protected.
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(true);
                    setMessage('');
                    setError('');
                  }}
                  className="change-password-button"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleChangePassword}
                className="password-form"
              >
                <div className="profile-form-group">
                  <label htmlFor="current-password">
                    Current Password
                  </label>

                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter current password"
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="new-password">
                    New Password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                  />

                  <span className="profile-field-note">
                    Password must be at least 6 characters.
                  </span>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="confirm-password">
                    Confirm New Password
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="password-actions">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="profile-primary-button"
                  >
                    {changingPassword
                      ? 'Changing...'
                      : 'Update Password'}
                  </button>

                  <button
                    type="button"
                    onClick={closePasswordForm}
                    disabled={changingPassword}
                    className="password-cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        <div className="profile-security-note">
          <span>🛡️</span>

          <div>
            <strong>Your information is protected</strong>

            <p>
              Your account details are securely managed
              by DirectMart.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}