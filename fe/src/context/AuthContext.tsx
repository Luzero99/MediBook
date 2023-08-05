import React, { createContext, useContext, useState } from 'react';
import { AuthContextValues } from '../types/AuthContextValues';

const defaultValues: AuthContextValues = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext(defaultValues);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(defaultValues.isLoggedIn);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
