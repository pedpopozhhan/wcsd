import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PERMISSION } from '@/common/permission';
import { useConditionalAuth } from './hooks';

export interface IProtecedRouteProps {
  permissions: PERMISSION[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProtectedRoute: React.FC<IProtecedRouteProps> = (props) => {
  const auth = useConditionalAuth();
  if (!auth.isAuthenticated) {
    // also check permissions in future if needed
    console.error('Unauthorized');
    return <Navigate to='logged-out' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
