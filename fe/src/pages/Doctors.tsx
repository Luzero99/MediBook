import { useEffect, useState } from 'react';
import { DoctorsResponse } from '../types/DoctorsResponse';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { BookAppointmentRequest } from '../types/BookAppointmentRequest';
import { useNavigate } from 'react-router-dom';

export const Doctors = () => {
  const [data, setData] = useState<null | DoctorsResponse>(null);
  const [openBackdropId, setOpenBackdropId] = useState<null | string>(null);
  const { role, id, token } = useAuthContext();
  const { fetchData } = useHttp();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    (async () => {
      const { data: response, status } = await fetchData<DoctorsResponse, null>(
        'http://localhost:8080/api/doctor/all',
        HTML_METHOD_TYPE.GET
      );
      if (status === 200) {
        setData(response);
      }
    })();
  }, []);

  const handleBookApointment = async (doctorId: string) => {
    if (selectedDate && selectedTime) {
      setIsLoading(true);
      const formattedDate = dayjs(selectedDate).format('DD-MM-YYYY');
      const formattedTime = dayjs(selectedTime).format('HH:mm');
      const dateTime = dayjs(
        formattedDate + ' ' + formattedTime,
        'DD-MM-YYYY HH:mm'
      );

      const requestData: BookAppointmentRequest = {
        userId: id!,
        doctorId,
        date: dateTime.toISOString(),
      };

      try {
        console.log(requestData);
        const { data: response, status } = await fetchData<
          undefined,
          BookAppointmentRequest
        >(
          'http://localhost:8080/api/appointment',
          HTML_METHOD_TYPE.POST,
          requestData,
          { Authorization: 'Bearer ' + token }
        );

        if (status === 200) {
          navigate('/appointments');
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenBackdrop = (id: string) => {
    setOpenBackdropId(id);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdropId(null);
  };

  return (
    <Container fixed>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2.6rem',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {data &&
          data.map((doctor) => (
            <Card sx={{ width: '24rem' }} key={doctor.id}>
              <CardContent>
                <Typography gutterBottom fontWeight="bold" variant="h5">
                  {doctor.userFirstName} {doctor.userLastName}
                </Typography>
                <Typography padding="1rem 0">
                  Speciality: {doctor.speciality}
                </Typography>
                <Typography
                  padding="1rem 0"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  Bio: {doctor.bio}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleOpenBackdrop(doctor.id)}
                >
                  Book Appointment
                </Button>
              </CardActions>
            </Card>
          ))}
        {openBackdropId && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Backdrop open={true}>
              {role && role === 'ROLE_DOCTOR' ? (
                <Alert severity="error">You are a doctor!</Alert>
              ) : (
                <Box
                  sx={{
                    border: '2px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '2rem',
                    boxShadow: '1px 1px 1px #333',
                    gap: '4rem',
                    background: '#eee',
                  }}
                >
                  <Typography variant="h4">Book Apointment</Typography>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={dayjs() as any}
                  />
                  <TimePicker
                    label="Select Time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!selectedDate || !selectedTime || isLoading}
                    onClick={() => handleBookApointment(openBackdropId)}
                  >
                    Book!
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCloseBackdrop}
                  >
                    Close
                  </Button>
                </Box>
              )}
            </Backdrop>
          </LocalizationProvider>
        )}
      </Box>
    </Container>
  );
};
