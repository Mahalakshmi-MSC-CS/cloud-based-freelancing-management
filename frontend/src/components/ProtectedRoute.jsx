import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if unauthorized for this specific role route
    const fallbackPath = user.role === 'client' ? '/client-dashboard' : '/freelancer-dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">
      <Navbar />
      <div className="app-layout flex-grow-1 overflow-hidden">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
