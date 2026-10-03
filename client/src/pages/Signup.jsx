import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/signup', form);

      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-container">

        <div className="signup-intro">
          <div className="signup-brand-icon">🌿</div>

          <h1>Join DirectMart</h1>

          <p>
            Create your account and connect directly
            with your local community.
          </p>
        </div>

        <div className="signup-card">

          <div className="signup-card-header">
            <h2>Create your account</h2>
            <p>It only takes a minute to get started.</p>
          </div>

          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">

            <div className="signup-form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="role">Account type</label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="buyer">I am a Buyer</option>
                <option value="seller">I am a Seller</option>
              </select>

              <p className="role-help">
                Choose how you plan to use DirectMart.
              </p>
            </div>

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>

          <div className="signup-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="login-link-button">
            Sign in to DirectMart
          </Link>

        </div>

        <p className="signup-footer">
          By joining DirectMart, you can discover products
          directly from local producers and sellers.
        </p>

      </div>
    </main>
  );
}