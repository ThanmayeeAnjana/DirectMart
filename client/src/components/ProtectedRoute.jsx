import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a page with this to require login, optionally restricted to one role.
// Usage: <ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
