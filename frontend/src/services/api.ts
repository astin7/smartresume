import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5050', // Replace with your actual backend URL if different
});

// This interceptor automatically attaches your JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});