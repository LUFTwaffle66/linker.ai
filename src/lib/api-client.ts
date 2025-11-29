import Axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

const getApiBaseUrl = () => {
  // For production with custom API domain
  if (env.API_URL && env.API_URL.startsWith('http')) {
    return env.API_URL;
  }
  // Always use /api for relative paths (no locale prefix)
  return '/api';
};

export const api = Axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response; // ← Return the full response
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  },
);
