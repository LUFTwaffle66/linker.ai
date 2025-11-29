import Axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

// ⬇⬇⬇ tahle verze je správně, tu nech
const stripLocalePrefix = (pathname: string) =>
  pathname.replace(/^\/(en|fr)(?=\/api)/, '');

const getApiBaseUrl = () => {
  // For production with custom API domain
  if (env.API_URL && env.API_URL.startsWith('http')) {
    try {
      const url = new URL(env.API_URL);
      const sanitizedPathname = stripLocalePrefix(url.pathname);

      url.pathname = sanitizedPathname.startsWith('/api') ? sanitizedPathname : '/api';

      return url.toString();
    } catch (error) {
      console.error('Failed to parse API_URL, falling back to relative /api:', error);
    }
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
    return response; // vracíme celý Axios response, ne response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  },
);