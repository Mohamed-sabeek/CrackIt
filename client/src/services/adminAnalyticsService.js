import api from '../config/api';

const adminAnalyticsService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  }
};

export default adminAnalyticsService;
