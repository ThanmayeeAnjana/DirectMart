import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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
    <div
      style={{
        maxWidth: 500,
        margin: '40px auto',
        padding: '20px',
      }}
    >
      <h2>Forgot Password</h2>

      <p>
        Enter your email address to request a password reset.
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
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '8px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Generating reset link...'
            : 'Reset Password'}
        </button>
      </form>

      {resetLink && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <strong>Development Reset Link</strong>

          <p>
            In a real application, this link would be
            sent to the user's email.
          </p>

          <Link to={resetLink.replace('http://localhost:3000', '')}>
            Open Reset Password Page
          </Link>
        </div>
      )}

      <p style={{ marginTop: '20px' }}>
        <Link to="/login">
          Back to Login
        </Link>
      </p>
    </div>
  );
}