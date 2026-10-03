import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(
    searchParams.get('email') || ''
  );
  const [otp, setOtp] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!email.trim() || !otp.trim()) {
      setError('Email and OTP are required');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/verify-email', {
        email: email.trim(),
        otp: otp.trim(),
      });

      // Login only after successful email verification
      login(response.data.token, response.data.user);

      setMessage('Email verified successfully!');

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Verification failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Enter your email first');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/resend-otp', {
        email: email.trim(),
      });

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not resend OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
      }}
    >
      <h2>Verify Your Email</h2>

      <p>
        Enter the 6-digit OTP sent to your email address.
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

      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>OTP</label>
          <br />

          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, '')
              )
            }
            placeholder="Enter 6-digit OTP"
            required
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '20px',
              letterSpacing: '5px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <br />

      <button
        type="button"
        onClick={handleResend}
        disabled={loading}
      >
        Resend OTP
      </button>
    </div>
  );
}