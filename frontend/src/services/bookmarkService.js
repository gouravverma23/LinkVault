import api from './api';

export const bookmarkService = {
  getAll: async (params = {}) => {
    const res = await api.get('/bookmarks', { params });
    return res.data;
  },

  getOne: async (id) => {
    const res = await api.get(`/bookmarks/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/bookmarks', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/bookmarks/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/bookmarks/${id}`);
    return res.data;
  },

  toggleFavorite: async (id) => {
    const res = await api.put(`/bookmarks/${id}/favorite`);
    return res.data;
  },

  getFavorites: async () => {
    const res = await api.get('/bookmarks/favorites');
    return res.data;
  },

  search: async (query) => {
    const res = await api.get('/bookmarks/search', { params: { q: query } });
    return res.data;
  },

  trackClick: async (id) => {
    const res = await api.put(`/bookmarks/${id}/click`);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/bookmarks/stats');
    return res.data;
  },

  exportBookmarks: async (format = 'json') => {
    const res = await api.get('/bookmarks/export', { params: { format } });
    return res.data;
  },

  importBookmarks: async (bookmarks) => {
    const res = await api.post('/bookmarks/import', { bookmarks });
    return res.data;
  },

  getPreview: async (url) => {
    const res = await api.post('/preview', { url });
    return res.data;
  },
};
