import axios from 'axios';

// Base URL for the Django backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const tournamentAPI = {
  getStats: () => api.get('/api/tournament/stats/'),
  updateStats: (data: any) => api.put('/api/tournament/stats/', data),
};

export const teamsAPI = {
  list: () => api.get('/api/teams/'),
  create: (data: any) => api.post('/api/teams/', data),
  update: (id: number, data: any) => api.put(`/api/teams/${id}/`, data),
  delete: (id: number) => api.delete(`/api/teams/${id}/`),
};

export const adjudicatorsAPI = {
  list: () => api.get('/api/adjudicators/'),
  create: (data: any) => api.post('/api/adjudicators/', data),
  update: (id: number, data: any) => api.put(`/api/adjudicators/${id}/`, data),
  delete: (id: number) => api.delete(`/api/adjudicators/${id}/`),
};

export default api;
