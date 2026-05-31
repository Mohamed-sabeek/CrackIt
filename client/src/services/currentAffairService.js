import api from '../config/api';

const BASE = '/current-affairs';

export const getCurrentAffairs = (filters = {}, page = 1, limit = 12) => {
  const params = new URLSearchParams();
  if (filters.search)  params.append('search', filters.search);
  if (filters.year && filters.year !== 'All') params.append('year', filters.year);
  if (filters.sort)    params.append('sort', filters.sort);
  params.append('page', page);
  params.append('limit', limit);
  return api.get(`${BASE}?${params}`).then(r => r.data);
};

export const createCurrentAffair = (data, token) =>
  api.post(BASE, data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const updateCurrentAffair = (id, data, token) =>
  api.put(`${BASE}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const togglePublishCurrentAffair = (id, token) =>
  api.patch(`${BASE}/${id}/publish`, {}, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const deleteCurrentAffair = (id, token) =>
  api.delete(`${BASE}/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
