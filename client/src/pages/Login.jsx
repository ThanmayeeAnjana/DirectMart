import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-shape login-shape-one"></div>
      <div className="login-background-shape login-shape-two"></div>

      <div className="login-container">

        <div className="login-brand">
          <div className="login-brand-icon">
            🌿
          </div>

          <span className="login-eyebrow">
            WELCOME TO DIRECTMART
          </span>

          <h1>Welcome back</h1>

          <p>
            Sign in to continue shopping directly from
            local producers.
          </p>
        </div>

        <div className="login-card">

          <div className="login-card-header">
            <span>YOUR ACCOUNT</span>
            <h2>Sign in</h2>
            <p>
              Enter your details to access your account.
            </p>
          </div>

          {error && (
            <div className="login-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">

              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-button-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="login-divider">
            <span>New to DirectMart?</span>
          </div>

          <Link
            to="/signup"
            className="signup-button"
          >
            Create an account
            <span>→</span>
          </Link>

        </div>

        <p className="login-footer">
          Fresh products. Local producers.
          <br />
          Direct to you.
        </p>

      </div>
    </main>
  );
}