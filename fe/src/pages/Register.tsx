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
import React from 'react';
import { Link } from 'react-router-dom';

export const Register = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Stack direction="row" spacing={2} marginTop={2} marginBottom={0.8}>
            <TextField
              fullWidth
              required
              id="first-name"
              name="first-name"
              label="First Name"
              autoComplete="first-name"
              autoFocus
            />
            <TextField
              fullWidth
              required
              id="last-name"
              name="last-name"
              label="Last Name"
              autoComplete="last-name"
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
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: '.8rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
