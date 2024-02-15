import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks';
import { PERMISSION } from '@/common/permission';

export interface IProtecedRouteProps {
  permissions: PERMISSION[];
}

const ProtectedRoute: React.FC<IProtecedRouteProps> = (props) => {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = user ? props.permissions.every((x) => user.permissions.includes(x)) : false;
  // not sure how to integrate this with platform team, but cross that bridge then

  if (!isAuthenticated) {
    console.error('Unauthorized');
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/' replace />;
};

export default ProtectedRoute;
