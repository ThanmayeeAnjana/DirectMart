import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <select name="role" value={form.role} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          <option value="buyer">I am a Buyer</option>
          <option value="seller">I am a Seller</option>
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
