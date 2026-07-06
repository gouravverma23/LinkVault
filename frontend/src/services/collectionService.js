import api from './api';

export const collectionService = {
  getAll: async () => {
    const res = await api.get('/collections');
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/collections', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/collections/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/collections/${id}`);
    return res.data;
  },
};
