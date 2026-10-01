import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      setMessage(
        response.data.message || 'Password reset successfully'
      );

      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '40px auto',
        padding: '20px',
      }}
    >
      <h2>Reset Password</h2>

      <p>
        Enter your new password below.
      </p>

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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>New Password</label>
          <br />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Confirm New Password</label>
          <br />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm new password"
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Resetting Password...'
            : 'Set New Password'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        <Link to="/login">
          Back to Login
        </Link>
      </p>
    </div>
  );
}