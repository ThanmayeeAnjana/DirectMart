import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

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

  // Change password states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

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
          err.response?.data?.message || 'Failed to load profile'
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

      const response = await api.put('/auth/profile', {
        name: name.trim(),
        address: address.trim(),
      });

      const updatedUser = response.data.user;

      const currentToken = localStorage.getItem('token');

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

      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setMessage(
        response.data.message || 'Password changed successfully!'
      );

      // Clear password fields after successful change
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

  if (loading) {
    return <div style={{ padding: '30px' }}>Loading profile...</div>;
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '20px',
      }}
    >
      <h2>My Profile</h2>

      {message && (
        <p style={{ color: 'green' }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {/* Profile section */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            disabled
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Address</label>
          <br />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {user?.role === 'seller' && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Seller approval status: </strong>

            {approved ? (
              <span style={{ color: 'green' }}>Approved</span>
            ) : (
              <span style={{ color: 'orange' }}>
                Pending approval
              </span>
            )}
          </div>
        )}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>

      {/* Change password section */}
      <hr style={{ margin: '40px 0' }} />

<h3>Password</h3>

<p>
  Change your password if you want to update your account security.
</p>

{!showChangePassword ? (
  <button
    type="button"
    onClick={() => {
      setShowChangePassword(true);
      setMessage('');
      setError('');
    }}
  >
    Change Password
  </button>
) : (
  <form onSubmit={handleChangePassword}>
    <div style={{ marginBottom: '15px' }}>
      <label>Current Password</label>
      <br />
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label>New Password</label>
      <br />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label>Confirm New Password</label>
      <br />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />
    </div>

    <button
      type="submit"
      disabled={changingPassword}
      style={{ marginRight: '10px' }}
    >
      {changingPassword
        ? 'Changing Password...'
        : 'Change Password'}
    </button>

    <button
      type="button"
      onClick={() => {
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setShowChangePassword(false);
        setMessage('');
        setError('');
      }}
      disabled={changingPassword}
    >
      Cancel
    </button>
  </form>
)}
      
</div>
  );
}