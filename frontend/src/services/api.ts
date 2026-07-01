import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://smartresume-api-pbz5.onrender.com'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});