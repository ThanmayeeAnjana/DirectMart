import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Signup no longer logs the user in.
      // Send them to the email verification page.
      navigate(
        `/verify-email?email=${encodeURIComponent(res.data.email)}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400 }}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '0.5rem',
          }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '0.5rem',
          }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '0.5rem',
          }}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '0.5rem',
          }}
        >
          <option value="buyer">I am a Buyer</option>
          <option value="seller">I am a Seller</option>
        </select>

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}