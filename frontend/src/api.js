import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api' 
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    try {
      const token = JSON.parse(profile).token;
      if (token) req.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.error('Invalid profile in localStorage', e);
    }
  }
  return req;
});

export default API;
