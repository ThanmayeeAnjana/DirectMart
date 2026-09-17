import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">DirectMart</Link>
      <Link to="/cart">Cart</Link>

      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/signup">Sign Up</Link>}

      {user && user.role === 'buyer' && <Link to="/my-orders">My Orders</Link>}
      {user && user.role === 'seller' && <Link to="/seller/dashboard">Seller Dashboard</Link>}
      {user && <button onClick={handleLogout}>Logout ({user.name})</button>}
    </nav>
  );
}
