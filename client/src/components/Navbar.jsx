import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" className="brand" onClick={closeMenu}>
            <span className="brand-icon">🌿</span>

            <span className="brand-text">
              Direct<span>Mart</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className={`nav-menu ${menuOpen ? 'nav-menu-open' : ''}`}>

            <Link
              to="/"
              className="nav-link"
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              to="/cart"
              className="nav-link"
              onClick={closeMenu}
            >
              <span className="nav-icon">🛒</span>
              Cart
            </Link>

            {/* Guest navigation */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="nav-signup"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Logged-in navigation */}
            {user && (
              <>
                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Profile
                </Link>

                {/* Buyer */}
                {user.role === 'buyer' && (
                  <Link
                    to="/my-orders"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    My Orders
                  </Link>
                )}

                {/* Seller */}
                {user.role === 'seller' && (
                  <Link
                    to="/seller/dashboard"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Seller Dashboard
                  </Link>
                )}

                {/* Admin */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Logout */}
                <button
                  className="nav-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </nav>
    </header>
  );
}