import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import { ErrorResponse } from '../types/ErrorResponse';
import { AuthResponse } from '../types/AuthResponse';

type RoleType = 'ROLE_PATIENT' | 'ROLE_DOCTOR';

export const RoleSelector = () => {
  const { token, role, id, login } = useAuthContext();
  const { fetchData } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'ROLE_USER') {
      navigate('/');
    }
  }, [role]);

  const handleSelect = async (role: RoleType) => {
    setIsLoading(true);

    try {
      const { data, status } = await fetchData<
        AuthResponse | ErrorResponse,
        { id: string; role: RoleType }
      >(
        'http://localhost:8080/api/user/role',
        HTML_METHOD_TYPE.POST,
        { id: id!, role },
        { Authorization: 'Bearer ' + token }
      );
      if (status === 200) {
        const { access_token }: AuthResponse = data as AuthResponse;
        login(access_token);
        navigate('/profile');
      } else {
        const { error }: ErrorResponse = data as ErrorResponse;
        console.error('Error', error);
      }
    } catch (error) {
      console.error('An error occurred', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fixed>
      {isLoading ? (
        <Box textAlign="center">
          <CircularProgress sx={{ mt: '2.2rem' }} />
        </Box>
      ) : (
        <Stack justifyContent="center" alignItems="center" spacing="4.4rem">
          <Typography variant="h3" component="h2">
            Select your profile type
          </Typography>
          <Stack direction="row" spacing="2.4rem">
            <Button
              variant="contained"
              sx={{ padding: '0.4rem 4.4rem' }}
              onClick={() => handleSelect('ROLE_DOCTOR')}
            >
              Doctor
            </Button>
            <Button
              variant="contained"
              sx={{ padding: '0.4rem 4.4rem' }}
              onClick={() => handleSelect('ROLE_PATIENT')}
            >
              Patient
            </Button>
          </Stack>
        </Stack>
      )}
    </Container>
  );
};
