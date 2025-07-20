import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAzureAuth } from './AzureAuthProvider';

const ProtectedRoute = () => {
  const { user, loading } = useAzureAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
