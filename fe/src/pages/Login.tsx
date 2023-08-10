import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link as LinkMui,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { FormEventHandler, ReactEventHandler, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { RegisterRequest } from '../types/RegisterRequest';
import { useAuthContext } from '../contexts/AuthContext';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import { ErrorResponse } from '../types/ErrorResponse';
import { AuthResponse } from '../types/AuthResponse';
import { FormikForm } from '../components/FormikForm/FormikForm';
import { AxiosError } from 'axios';

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginRequest = Pick<RegisterRequest, 'email' | 'password'>;

const initialValues: LoginRequest = {
  email: '',
  password: '',
};

export const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const { fetchData } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginRequest) => {
    setIsLoading(true);
    try {
      const { data, status } = await fetchData<
        AuthResponse | ErrorResponse,
        LoginRequest
      >('http://localhost:8080/api/user/login', HTML_METHOD_TYPE.POST, values);

      if (status === 200) {
        const { access_token }: AuthResponse = data as AuthResponse;
        setLoginError(null);
        login(access_token);
        navigate('/');
      } else {
        const { error }: ErrorResponse = data as ErrorResponse;
        setLoginError(error);
      }
    } catch (error) {
      console.error('An error occurred', error);
      setLoginError((error as AxiosError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, values, touched, handleChange, handleBlur }) => (
            <>
              {loginError && (
                <Typography
                  color="error"
                  variant="body1"
                  textAlign="center"
                  padding="2rem"
                >
                  {loginError}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                type="password"
                autoComplete="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <LinkMui
                    component={Link}
                    to="/forgot-password"
                    variant="body2"
                  >
                    Forgot password?
                  </LinkMui>
                </Grid>
                <Grid item>
                  <LinkMui component={Link} to="/register" variant="body2">
                    {"Don't have an account? Register"}
                  </LinkMui>
                </Grid>
              </Grid>
            </>
          )}
        </FormikForm>
      </Box>
    </Container>
  );
};
