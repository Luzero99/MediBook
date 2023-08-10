import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DoctorProfileResponse } from '../types/DoctorProfileResponse';
import { useEffect, useState } from 'react';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import { useAuthContext } from '../contexts/AuthContext';
import * as Yup from 'yup';
import { FormikForm } from '../components/FormikForm/FormikForm';
import { SuccessResponse } from '../types/SuccessResponse';
import { ErrorResponse } from '../types/ErrorResponse';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const validationSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  firstName: Yup.string().trim().required('First name is required'),
  lastName: Yup.string().trim().required('Last name is required'),
  speciality: Yup.string().trim().required('Speciality is required'),
  bio: Yup.string().trim().required('Bio is required'),
  profilePicture: Yup.mixed().required('Profile picture is required'),
});

export const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState<DoctorProfileResponse | null>(
    null
  );
  const [imageData, setImageData] = useState(null);

  const { fetchData } = useHttp();
  const { token, id } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: responseData, status } = await fetchData<
        DoctorProfileResponse,
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
        speciality: responseData.speciality || '',
        bio: responseData.bio || '',
        profilePicture: responseData.profilePicture || '',
      };

      try {
        const imageResponse = await axios.get(
          `http://localhost:8080/api/doctor/${id}`,
          {
            responseType: 'arraybuffer',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setImageData(imageResponse.data);
      } catch (e) {
        setImageData(null);
      }

      setDoctorData(sanitzedData);
    })();
  }, []);

  const handleSubmit = async (values: DoctorProfileResponse) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('id', values.id);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('speciality', values.speciality);
    formData.append('bio', values.bio);
    formData.append('profilePicture', values.profilePicture);

    try {
      const { data, status } = await fetchData<
        SuccessResponse | ErrorResponse,
        any
      >('http://localhost:8080/api/doctor', HTML_METHOD_TYPE.PATCH, formData, {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      });
      if (status === 200) {
        navigate('/');
      }
    } catch (err) {
      console.error('An error occurred', err);
    } finally {
      setIsLoading(false);
    }
  };

  const profileImage =
    imageData !== null
      ? `data:image/jpeg;base64,${btoa(
          new Uint8Array(imageData).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )}`
      : 'Profile';

  return (
    <Container fixed>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Stack alignItems="center" spacing="2rem">
          <Typography variant="h4" component="h3">
            Doctor Profile
          </Typography>
          {doctorData && (
            <Box
              sx={{
                display: 'flex',
                gap: '4.6rem',
                padding: '3.6rem 4.6rem',
                alignItems: 'center',
                border: '1px solid black',
              }}
            >
              <Box>
                <Avatar
                  sx={{ width: '8rem', height: '8rem' }}
                  alt={`${doctorData.firstName} ${doctorData.lastName}`}
                  src={profileImage}
                />
              </Box>
              <FormikForm
                initialValues={doctorData}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  touched,
                  errors,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.6rem',
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
                      label="Speciality"
                      id="speciality"
                      name="speciality"
                      value={values.speciality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.speciality && Boolean(errors.speciality)}
                      helperText={touched.speciality && errors.speciality}
                    />
                    <TextField
                      label="Bio"
                      id="bio"
                      name="bio"
                      multiline
                      rows={4}
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.bio && Boolean(errors.bio)}
                      helperText={touched.bio && errors.bio}
                    />
                    <TextField
                      label="Profile Picture"
                      id="profile-picture"
                      name="profilePicture"
                      type="file"
                      // value={values.profilePicture}
                      onChange={(event) => {
                        setFieldValue(
                          'profilePicture',
                          (event.currentTarget as any).files[0]
                        );
                      }}
                      onBlur={handleBlur}
                      error={
                        touched.profilePicture && Boolean(errors.profilePicture)
                      }
                    />
                    <Button type="submit">Update</Button>
                  </Box>
                )}
              </FormikForm>
            </Box>
          )}
        </Stack>
      )}
    </Container>
  );
};
