import React, { ReactNode } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { ErrorPage } from '../../pages/error-page';

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuthContext();

  if (!isLoggedIn) {
    return <ErrorPage message="Login to view the content of this page!" />;
  }

  return <>{children}</>;
};
