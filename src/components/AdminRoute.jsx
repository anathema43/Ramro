import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute({ children }) {
  const { currentUser, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin (you can modify this logic based on your user structure)
  const isAdmin = currentUser.email === 'admin@ramro.com' || currentUser.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}