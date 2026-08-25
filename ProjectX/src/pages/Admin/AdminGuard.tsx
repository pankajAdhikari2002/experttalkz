import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminGuard() {
  const location = useLocation();
  const token = localStorage.getItem('expertTalkz_auth_token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      localStorage.removeItem('expertTalkz_auth_token');
      localStorage.removeItem('expertTalkz_active_user');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const payload = JSON.parse(atob(parts[1]));

    // Check expiration if exp claim is present
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('expertTalkz_auth_token');
      localStorage.removeItem('expertTalkz_active_user');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (payload.role !== 'admin') {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (err) {
    console.error('Failed to verify admin token:', err);
    localStorage.removeItem('expertTalkz_auth_token');
    localStorage.removeItem('expertTalkz_active_user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}
