import { useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { role } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'ROLE_USER') {
      navigate('/role-select');
    } else if (role === 'ROLE_PATIENT') {
      navigate('/patient-profile');
    } else if (role === 'ROLE_DOCTOR') {
      navigate('/doctor-profile');
    }
  }, [role, navigate]);

  return <h1>Profile</h1>;
};
