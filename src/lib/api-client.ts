import Axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

// Always use /api as base URL (no locale prefix)
const getApiBaseUrl = () => {
  return '/api';
};

export const api = Axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  (response) => {
    // Return the full Axios response (caller will use response.data)
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    console.error('URL:', error.config?.url);
    return Promise.reject(error);
  },
);
