import api from '../config/api';

const API_URL = '/books';

export const getBooks = async (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.board && filters.board !== 'All') query.append('board', filters.board);
  if (filters.className && filters.className !== 'All') query.append('className', filters.className);
  if (filters.subject && filters.subject !== 'All') query.append('subject', filters.subject);
  if (filters.search) query.append('search', filters.search);

  const response = await api.get(`${API_URL}?${query.toString()}`);
  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const createBook = async (bookData, token) => {
  const response = await api.post(API_URL, bookData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateBook = async (id, bookData, token) => {
  const response = await api.put(`${API_URL}/${id}`, bookData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteBook = async (id, token) => {
  const response = await api.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
