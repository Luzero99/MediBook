import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export enum HTML_METHOD_TYPE {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export const useHttp = () => {
  const fetchData = async <T, K>(
    url: string,
    method: HTML_METHOD_TYPE,
    userData?: K,
    userHeaders?: Record<string, string>
  ): Promise<{ status: number; data: T }> => {
    const config: AxiosRequestConfig = {
      url,
      method,
      data: userData || undefined,
      headers: {
        'Content-Type': 'application/json',
        ...userHeaders,
      },
    };

    try {
      const response: AxiosResponse<T> = await axios.request(config);
      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = 'Something went wrong! Try again.';

      if (axiosError.response?.data) {
        errorMessage = (axiosError.response.data as any).error;
      }

      axiosError.message = errorMessage;

      throw axiosError;
    }
  };

  return { fetchData };
};
