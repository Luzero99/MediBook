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
import React, { FormEventHandler, ReactEventHandler } from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            type="password"
            autoComplete="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <LinkMui component={Link} to="/forgot-password" variant="body2">
                Forgot password?
              </LinkMui>
            </Grid>
            <Grid item>
              <LinkMui component={Link} to="/register" variant='body2'>
                {"Don't have an account? Register"}
              </LinkMui>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
