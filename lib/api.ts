import axios from 'axios';

const defaultBaseUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : 'https://server.almoslem.haniipp.space';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || defaultBaseUrl;

export const backendClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});
