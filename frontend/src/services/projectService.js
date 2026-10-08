import api from './api';

export const projectService = {
  async getProjects(params = {}) {
    const response = await api.get('/projects/', { params });
    // DRF pagination returns { results: [...] } or array directly
    return response.data.results || response.data;
  },

  async getProject(id) {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },

  async createProject(projectData) {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },

  async updateProject(id, projectData) {
    const response = await api.put(`/projects/${id}/`, projectData);
    return response.data;
  },

  async updateProjectStatus(id, status) {
    const response = await api.patch(`/projects/${id}/`, { status });
    return response.data;
  },

  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}/`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/projects/stats/');
    return response.data;
  },
};
