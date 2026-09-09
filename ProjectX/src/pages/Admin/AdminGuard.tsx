import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken, isTokenExpired, getDecodedToken, clearAuthSession } from '../../utils/authStorage';

export default function AdminGuard() {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verify expiration
  if (isTokenExpired(token)) {
    clearAuthSession();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const payload = getDecodedToken(token);
  if (!payload || payload.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

