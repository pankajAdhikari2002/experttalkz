import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminGuard() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // We parse the token payload to check for the admin role
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    if (decodedPayload.role !== 'admin') {
      return <Navigate to="/" replace />; // Redirect non-admins to home
    }

    return <Outlet />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
}
