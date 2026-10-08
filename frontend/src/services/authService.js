import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login/', { username, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.patch('/auth/profile/', profileData);
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...storedUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return response.data;
  },

  async getFreelancers() {
    const response = await api.get('/auth/freelancers/');
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
