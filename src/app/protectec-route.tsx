import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks';
import { PERMISSION } from '@/common/permission';

export interface IProtecedRouteProps {
  permissions: PERMISSION[];
}

const ProtectedRoute: React.FC<IProtecedRouteProps> = (props) => {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = user ? props.permissions.every((x) => user.permissions.includes(x)) : false;
  if (!isAuthenticated) {
    console.log('not authed');
  }
  return isAuthenticated ? <Outlet /> : <Navigate to='/' replace />;
};

export default ProtectedRoute;
