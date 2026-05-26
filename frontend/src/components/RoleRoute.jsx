import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user?.role?.toLowerCase())
    ? <Outlet />
    : <Navigate to="/unauthorized" />;
};

export default RoleRoute;
