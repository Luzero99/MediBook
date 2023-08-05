import { Box, Container, Stack, Typography } from '@mui/material';

export const Home = () => {
  return (
    <Container maxWidth="xl">
      <Stack spacing={4.4}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap="1.6rem"
        >
          <Box>
            <Typography variant="h4" component="h1">
              Discover Excellent Medical Care Online
            </Typography>
            <Typography variant="body1" component="h2" align="justify">
              Welcome to our innovative medical platform that allows you to
              easily browse profiles of qualified doctors and schedule medical
              appointments online. No matter your health needs, our website
              enables you to quickly find the right specialist and take
              advantage of the convenience of virtual consultations.
            </Typography>
          </Box>
          <Box sx={{ width: '64rem' }}>
            <img
              style={{ width: '100%', borderRadius: '24px' }}
              src="/assets/woman-doctor.jpg"
              alt="Doctor"
            />
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap="1.6rem"
        >
          <Box sx={{ width: '64rem' }}>
            <img
              style={{
                width: '100%',
                borderRadius: '24px',
              }}
              src="/assets/doctor-uniform.jpg"
              alt="Doctor"
            />
          </Box>
          <Box>
            <Typography variant="h5" component="h3">
              Extensive Doctor Database
            </Typography>
            <Typography variant="body2" align="justify">
              Browse through hundreds of profiles of doctors from various
              specialties, learn about their experience and education.
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap="1.6rem"
        >
          <Box>
            <Typography variant="h5" component="h3">
              Easy Appointment Booking
            </Typography>
            <Typography variant="body2" align="justify">
              Schedule an appointment with your chosen doctor in just a few
              clicks. Our system allows you to select a convenient date and time
              that fits your schedule.
            </Typography>
          </Box>
          <Box sx={{ width: '64rem' }}>
            <img
              style={{
                width: '100%',
                borderRadius: '24px',
              }}
              src="/assets/calendar.jpg"
              alt="Doctor"
            />
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};
