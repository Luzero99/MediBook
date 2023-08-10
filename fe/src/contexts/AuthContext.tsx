import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextValues } from '../types/AuthContextValues';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { ExtendendJwtPayload } from '../types/ExtendendJwtPayload';

const TOKEN_KEY = "AUTH_TOKEN";

const defaultValues: AuthContextValues = {
  id: null,
  role: null,
  isLoggedIn: false,
  token: null,
  login: (newToken: string) => {},
  logout: () => {},
};

const AuthContext = createContext(defaultValues);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(defaultValues.isLoggedIn);
  const [token, setToken] = useState(defaultValues.token);
  const [role, setRole] = useState(defaultValues.role);
  const [id, setId] = useState(defaultValues.id);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      try {
        const decodedToken: ExtendendJwtPayload = jwtDecode(storedToken);
        if (decodedToken.exp) {
          const expirationTime = decodedToken.exp * 1000;
          if (Date.now() < expirationTime) {
            login(storedToken);
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = (newToken: string) => {
    const decodedToken: ExtendendJwtPayload = jwtDecode(newToken);
    
    if (decodedToken.role) {
      setRole(decodedToken.role);
    }

    if (decodedToken.id) {
      setId(decodedToken.id);
    }

    setToken(newToken);
    setIsLoggedIn(true);
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  const logout = ()  => {
    setToken("")
    setIsLoggedIn(false);
    setRole(null);
    setId(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, id, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
