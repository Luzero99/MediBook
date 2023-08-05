import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { ErrorPage } from './pages/error-page';
import { NavbarWrapper } from './components/Navbar/NavbarWrapper';
import { AuthProvider } from './context/AuthContext';
import { Doctors } from './pages/Doctors';
import { Appointments } from './pages/Appointments';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Logout } from '@mui/icons-material';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { ThemeProvider } from '@mui/material';
import theme from './utils/mui-theme';
import { ForgotPassword } from './pages/ForgotPassword';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavbarWrapper />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/doctors',
        element: <Doctors />,
      },
      {
        path: '/appointments',
        element: (
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/logout',
        element: (
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: '*',
        element: <ErrorPage message="Page not found!" />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
