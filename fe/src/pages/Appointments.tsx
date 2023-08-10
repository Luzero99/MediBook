import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import { AppointmentResponse } from '../types/AppointmentResponse';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export const Appointments = () => {
  const [data, setData] = useState<AppointmentResponse | null>(null);
  const { id, token } = useAuthContext();
  const { fetchData } = useHttp();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: response, status } = await fetchData<
        AppointmentResponse,
        null
      >(
        `http://localhost:8080/api/appointment/${id}`,
        HTML_METHOD_TYPE.GET,
        null,
        { Authorization: 'Bearer ' + token }
      );

      if (status === 200) {
        setData(
          response.map((appointment) => ({
            ...appointment,
            date: dayjs(appointment.date).format('HH:mm DD-MM-YYYY'),
          }))
        );
      }
    })();
  }, []);

  const handleCancelAppointment = async (appointmentId: string) => {
    const { data: response, status } = await fetchData<undefined, null>(
      `http://localhost:8080/api/appointment/${appointmentId}`,
      HTML_METHOD_TYPE.DELETE,
      null,
      { Authorization: 'Bearer ' + token }
    );
    if (status === 200) {
      navigate('/appointments');
    }
  };

  return (
    <Container fixed>
      <Box>
        <Typography variant="h3">Appointments</Typography>
        <Box mt="2.4rem">
          {!data ? (
            <Typography variant="h5">
              You don't have any appointments.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Speciality</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>
                        {appointment.doctorFirstName}{' '}
                        {appointment.doctorLastName}
                      </TableCell>
                      <TableCell>{appointment.doctorSpeciality}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                        >
                          Cancel Appointment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Container>
  );
};
