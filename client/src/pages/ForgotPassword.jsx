import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setResetLink('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/forgot-password', {
        email: email.trim(),
      });

      setMessage(response.data.message);

      // Development/testing only.
      // In production this link would be sent by email.
      if (response.data.resetLink) {
        setResetLink(response.data.resetLink);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to process password reset request'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-page">
      <div className="forgot-container">

        <div className="forgot-brand">
          <div className="forgot-brand-icon">🔐</div>

          <h1>Reset your password</h1>

          <p>
            No worries. Enter your email and we'll help
            you get back into your DirectMart account.
          </p>
        </div>

        <div className="forgot-card">

          <div className="forgot-card-header">
            <h2>Forgot password?</h2>
            <p>
              Enter the email address associated with your account.
            </p>
          </div>

          {message && (
            <div className="forgot-success">
              {message}
            </div>
          )}

          {error && (
            <div className="forgot-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="forgot-form">

            <div className="forgot-form-group">
              <label htmlFor="forgot-email">
                Email address
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              className="forgot-submit"
              disabled={loading}
            >
              {loading
                ? 'Generating reset link...'
                : 'Send reset instructions'}
            </button>

          </form>

          {resetLink && (
            <div className="reset-link-box">
              <div className="reset-link-title">
                Development Reset Link
              </div>

              <p>
                In a real application, this link would be
                sent to the user's email.
              </p>

              <Link
                className="reset-link-button"
                to={resetLink.replace(
                  'http://localhost:3000',
                  ''
                )}
              >
                Open Reset Password Page
              </Link>
            </div>
          )}

          <div className="forgot-back">
            <Link to="/login">
              ← Back to Login
            </Link>
          </div>

        </div>

        <p className="forgot-footer">
          Your account security matters to us.
        </p>

      </div>
    </main>
  );
}