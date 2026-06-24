import api from './api';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    const response = await api.get('/api/admin/analytics');
    return response.data;
  }
};
