import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const api = {
  get: async (endpoint) => {
    const res = await axios.get(`${API_URL}${endpoint}`);
    return res.data;
  },
  post: async (endpoint, data) => {
    const res = await axios.post(`${API_URL}${endpoint}`, data);
    return res.data;
  },
  patch: async (endpoint, data) => {
    const res = await axios.patch(`${API_URL}${endpoint}`, data);
    return res.data;
  },
  delete: async (endpoint) => {
    const res = await axios.delete(`${API_URL}${endpoint}`);
    return res.data;
  }
};
