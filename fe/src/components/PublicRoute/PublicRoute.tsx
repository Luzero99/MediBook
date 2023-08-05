import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import React from 'react';

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
