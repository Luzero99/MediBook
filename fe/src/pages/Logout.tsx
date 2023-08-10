import { useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HTML_METHOD_TYPE, useHttp } from '../hooks/useHttp';
import { SuccessResponse } from '../types/SuccessResponse';

export const Logout = () => {
  const { token } = useAuthContext();
  const { fetchData } = useHttp();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token);
    (async () => {
      const { data, status } = await fetchData<SuccessResponse, null>(
        'http://localhost:8080/api/user/logout',
        HTML_METHOD_TYPE.GET,
        null,
        { Authorization: 'Bearer ' + token }
      );
      logout();
      navigate('/');
    })();
  }, []);

  return <h1>Logout</h1>;
};
