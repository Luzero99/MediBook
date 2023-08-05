import { Alert, Box } from '@mui/material';
import React from 'react';

export const ErrorPage: React.FC<{ message?: string }> = ({ message }) => {
  const displayMessage = message || 'Something went wrong!';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}
    >
      <Alert severity="error" sx={{ p: '3.2rem 8rem' }}>
        {displayMessage}
      </Alert>
    </Box>
  );
};
