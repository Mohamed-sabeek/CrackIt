import api from '../config/api';

const examUpdateService = {
  // Get all exam updates (with pagination, filters)
  getExamUpdates: async (params) => {
    const response = await api.get('/exam-updates', { params });
    return response.data;
  },

  // Get a single exam update by ID
  getExamUpdateById: async (id) => {
    const response = await api.get(`/exam-updates/${id}`);
    return response.data;
  },

  // Create a new exam update (Admin only)
  createExamUpdate: async (data) => {
    const response = await api.post('/exam-updates', data);
    return response.data;
  },

  // Update an exam update (Admin only)
  updateExamUpdate: async (id, data) => {
    const response = await api.put(`/exam-updates/${id}`, data);
    return response.data;
  },

  // Toggle publish status (Admin only)
  togglePublish: async (id) => {
    const response = await api.patch(`/exam-updates/${id}/publish`);
    return response.data;
  },

  // Delete an exam update (Admin only)
  deleteExamUpdate: async (id) => {
    const response = await api.delete(`/exam-updates/${id}`);
    return response.data;
  }
};

export default examUpdateService;
