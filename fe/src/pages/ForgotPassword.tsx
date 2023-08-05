import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React from 'react';

export const ForgotPassword = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth="xs">
      {' '}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.2rem',
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          textTransform="uppercase"
          fontWeight="bold"
        >
          Forgot your password?
        </Typography>
        <Typography variant="body2" component="h3" align="center">
          Enter your email address bellow and we'll send you a link to reset
          your password.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
