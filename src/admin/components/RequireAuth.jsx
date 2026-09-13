import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple auth guard: checks localStorage flag set by AdminLogin
const RequireAuth = ({ children }) => {
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  if (!isAuth) {
    // Redirect unauthenticated users to admin login page
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
