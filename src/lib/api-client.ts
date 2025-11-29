import Axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

const normalizeApiBaseUrl = (url: string) => {
  if (!url) return '/api';
  if (url.startsWith('http')) return url;
  if (!url.startsWith('/')) return `/${url}`;
  return url;
};

export const api = Axios.create({
  baseURL: normalizeApiBaseUrl(env.API_URL),
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  },
);
