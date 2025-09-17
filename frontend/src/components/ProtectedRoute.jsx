import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '../api/client.js';

export default function ProtectedRoute({ children }) {
  const user = getUser();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}


