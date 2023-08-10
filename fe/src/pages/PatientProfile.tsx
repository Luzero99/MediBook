import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PatientProfileResponse } from '../types/PatientProfileResponse';
import { useEffect, useState } from 'react';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import { useAuthContext } from '../contexts/AuthContext';
import { FormikForm } from '../components/FormikForm/FormikForm';
import * as Yup from 'yup';
import { SuccessResponse } from '../types/SuccessResponse';
import { ErrorResponse } from '../types/ErrorResponse';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  firstName: Yup.string().trim().required('First name is required'),
  lastName: Yup.string().trim().required('Last name is required'),
  contactNumber: Yup.string()
    .trim()
    .required('Contact number is required')
    .length(9, 'Contact number must be 9 characters'),
  address: Yup.string().trim().required('Address is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
});

export const PatientProfile = () => {
  const [userData, setUserData] = useState<PatientProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token, id } = useAuthContext();
  const { fetchData } = useHttp();

  useEffect(() => {
    (async () => {
      const { data: responseData, status } = await fetchData<
        PatientProfileResponse,
        null
      >(
        `http://localhost:8080/api/user/profile/${id}`,
        HTML_METHOD_TYPE.GET,
        null,
        { Authorization: `Bearer ${token}` }
      );

      const sanitzedData = {
        ...responseData,
        firstName: responseData.firstName || '',
        lastName: responseData.lastName || '',
        contactNumber: responseData.contactNumber || '',
        address: responseData.address || '',
        dateOfBirth: responseData.dateOfBirth || new Date(),
      };

      setUserData(sanitzedData);
    })();
  }, []);

  const handleSubmit = async (values: PatientProfileResponse) => {
    setIsLoading(true);

    try {
      const { data, status } = await fetchData(
        'http://localhost:8080/api/patient',
        HTML_METHOD_TYPE.PATCH,
        values,
        { Authorization: `Bearer ${token}` }
      );

      if (status === 200) {
        navigate('/');
      }
    } catch (err) {
      console.error('An error occurred', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fixed>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Stack alignItems="center" spacing="2rem">
          <Typography variant="h4" component="h3">
            Patient Profile
          </Typography>
          {userData && (
            <FormikForm
              initialValues={userData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, touched, errors, handleChange, handleBlur }) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.6rem',
                    padding: '3.6rem 4.6rem',
                    border: '1px solid black',
                  }}
                >
                  <TextField
                    label="First Name"
                    id="first-name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                  <TextField
                    label="Last Name"
                    id="last-name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                  <TextField
                    label="Contact Number"
                    id="phone"
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.contactNumber && Boolean(errors.contactNumber)
                    }
                    helperText={touched.contactNumber && errors.contactNumber}
                  />
                  <TextField
                    label="Address"
                    id="address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                  <TextField
                    label="Date of Birth"
                    id="date-of-birth"
                    name="dateOfBirth"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={
                      touched.dateOfBirth && (errors.dateOfBirth as String)
                    }
                  />
                  <Button type="submit">Update</Button>
                </Box>
              )}
            </FormikForm>
          )}
        </Stack>
      )}
    </Container>
  );
};
