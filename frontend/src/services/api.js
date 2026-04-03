import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (password) => {
    const response = await apiClient.post('/auth/login', { password });
    return response.data;
  },
  verify: async () => {
    const response = await apiClient.post('/auth/verify');
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },
  update: async (data) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },
};

// Skills API
export const skillsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/skills');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/skills', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/skills/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/skills/${id}`);
    return response.data;
  },
};

// Education API
export const educationAPI = {
  getAll: async () => {
    const response = await apiClient.get('/education');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/education', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/education/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/education/${id}`);
    return response.data;
  },
};

// Certificates API
export const certificatesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/certificates');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/certificates', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/certificates/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/certificates/${id}`);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (category = null) => {
    const params = category ? { category } : {};
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  submit: async (data) => {
    const response = await apiClient.post('/contact', data);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/contact');
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Seed API
export const seedAPI = {
  seed: async () => {
    const response = await apiClient.post('/seed');
    return response.data;
  },
};

export default apiClient;