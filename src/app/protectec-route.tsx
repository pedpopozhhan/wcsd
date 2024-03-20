import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PERMISSION } from '@/common/permission';
import { useConditionalAuth } from './hooks';
import { hasResourceRole } from '@/common/token-utils';

export interface IProtecedRouteProps {
  permissions: PERMISSION[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProtectedRoute: React.FC<IProtecedRouteProps> = (props) => {
  const auth = useConditionalAuth();
  if (auth.user) {
    const hasPermissions = props.permissions.some((x) => {
      return hasResourceRole('finance', x, auth?.user?.access_token);
    });
    if (!auth.isAuthenticated || !hasPermissions) {
      return <Navigate to='unauthorized' />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
