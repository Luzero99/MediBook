import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Link as LinkMui,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { RegisterRequest } from '../types/RegisterRequest';
import { FormikForm } from '../components/FormikForm/FormikForm';
import { ErrorResponse } from '../types/ErrorResponse';
import { AuthResponse } from '../types/AuthResponse';
import { useAuthContext } from '../contexts/AuthContext';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import { AxiosError } from 'axios';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required('First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: Yup.string()
    .trim()
    .required('Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const initialValues: RegisterRequest = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export const Register = () => {
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const { fetchData } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterRequest) => {
    setIsLoading(true);
    try {
      const { data, status } = await fetchData<
        AuthResponse | ErrorResponse,
        RegisterRequest
      >(
        'http://localhost:8080/api/user/register',
        HTML_METHOD_TYPE.POST,
        values
      );

      if (status === 200) {
        const { access_token }: AuthResponse = data as AuthResponse;
        setRegistrationError(null);
        login(access_token);
        navigate('/');
      } else {
        const { error }: ErrorResponse = data as ErrorResponse;
        setRegistrationError(error);
      }
    } catch (error) {
      console.error('An error occurred', error);
      setRegistrationError((error as AxiosError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          sx={{
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <LinkMui component={Link} to="/login" variant="body2">
            Already have an account?
          </LinkMui>
        </Stack>
        <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, values, touched, handleChange, handleBlur }) => (
            <>
              {registrationError && (
                <Typography
                  color="error"
                  variant="body1"
                  textAlign="center"
                  padding="2rem"
                >
                  {registrationError}
                </Typography>
              )}
              <Stack
                direction="row"
                spacing={2}
                marginTop={2}
                marginBottom={0.8}
              >
                <TextField
                  fullWidth
                  required
                  id="first-name"
                  name="firstName"
                  label="First Name"
                  autoComplete="first-name"
                  autoFocus
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
                <TextField
                  fullWidth
                  required
                  id="last-name"
                  name="lastName"
                  label="Last Name"
                  autoComplete="last-name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Stack>
              <TextField
                margin="normal"
                fullWidth
                required
                id="email"
                type="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                margin="normal"
                fullWidth
                required
                id="password"
                type="password"
                name="password"
                label="Password"
                autoComplete="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: '.8rem',
                  paddingTop: '0.6rem',
                  paddingBottom: '0.6rem',
                }}
                disabled={isLoading}
              >
                Register
              </Button>
            </>
          )}
        </FormikForm>
      </Box>
    </Container>
  );
};
