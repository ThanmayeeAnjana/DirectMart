import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import './ResetPassword.css';

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
    <main className="reset-page">
      <div className="reset-container">

        <div className="reset-brand">
          <div className="reset-brand-icon">🔑</div>

          <h1>Create a new password</h1>

          <p>
            Choose a new password to secure your
            DirectMart account.
          </p>
        </div>

        <div className="reset-card">

          <div className="reset-card-header">
            <h2>Reset password</h2>
            <p>
              Your new password must be at least 6 characters long.
            </p>
          </div>

          {message && (
            <div className="reset-success">
              {message}
              <span>
                Redirecting you to login...
              </span>
            </div>
          )}

          {error && (
            <div className="reset-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="reset-form">

            <div className="reset-form-group">
              <label htmlFor="new-password">
                New password
              </label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter your new password"
                required
              />
            </div>

            <div className="reset-form-group">
              <label htmlFor="confirm-password">
                Confirm new password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Enter your new password again"
                required
              />
            </div>

            <div className="password-requirement">
              <span>✓</span>
              Password must contain at least 6 characters
            </div>

            <button
              type="submit"
              className="reset-submit"
              disabled={loading}
            >
              {loading
                ? 'Resetting password...'
                : 'Set new password'}
            </button>

          </form>

          <div className="reset-back">
            <Link to="/login">
              ← Back to Login
            </Link>
          </div>

        </div>

        <p className="reset-footer">
          Keep your account secure with a strong password.
        </p>

      </div>
    </main>
  );
}