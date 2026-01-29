import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { ApiError } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ErrorResponseData {
  error?: string;
  detail?: string | string[] | Array<{ loc: string[]; msg: string; type: string }>;
  message?: string;
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponseData>) => {
    if (error.response) {
      const errorData = error.response.data;
      let errorMessage = 'An error occurred';
      let errorMessages: string[] = [];
      
      if (errorData) {
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessages = errorData.detail.map((item) => {
              if (typeof item === 'string') {
                return item;
              }
              if (item.loc && item.msg) {
                const field = item.loc[item.loc.length - 1];
                return `${field}: ${item.msg}`;
              }
              return String(item);
            });
            errorMessage = errorMessages.join('; ');
          } else {
            errorMessage = errorData.detail;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      if (!errorMessage || errorMessage === 'An error occurred') {
        errorMessage = error.message || 'An error occurred';
      }
      
      const apiError: ApiError = {
        message: errorMessage,
        messages: errorMessages.length > 0 ? errorMessages : undefined,
        statusCode: error.response.status,
      };
      return Promise.reject(apiError);
    }
    const apiError: ApiError = {
      message: error.message || 'Network error',
      statusCode: 0,
    };
    return Promise.reject(apiError);
  }
);

export default api;
