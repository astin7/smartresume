import axios from 'axios';

export const API = axios.create({ baseURL: 'http://localhost:5050/api' });

// Automatically attach the JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// The connect
export const createAnalysis = (data: any) => API.post('/analysis', data);

// Fetching past analyses
export const getHistory = () => API.get('/analysis');

// Auth routes
export const loginUser = (credentials: any) => API.post('/auth/login', credentials);
export const signupUser = (userData: any) => API.post('/auth/register', userData);

// Settings / Resume cloud URL updates
export const uploadResumeLink = (url: string) => API.patch('/user/resume', { resumeUrl: url });