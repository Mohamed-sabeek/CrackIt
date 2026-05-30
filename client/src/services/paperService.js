import api from '../config/api';

const API_URL = '/papers';

export const getPapers = async (filters) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.exam && filters.exam !== 'All') params.append('exam', filters.exam);
  if (filters.stage && filters.stage !== 'All') params.append('stage', filters.stage);
  if (filters.paperType && filters.paperType !== 'All') params.append('paperType', filters.paperType);
  if (filters.year && filters.year !== 'All') params.append('year', filters.year);

  const response = await api.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

export const createPaper = async (paperData, token) => {
  const response = await api.post(API_URL, paperData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updatePaper = async (id, paperData, token) => {
  const response = await api.put(`${API_URL}/${id}`, paperData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deletePaper = async (id, token) => {
  const response = await api.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
