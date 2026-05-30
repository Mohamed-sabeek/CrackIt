import api from '../config/api';

// QUESTIONS
export const getQuestions = async (filters, token) => {
  const params = new URLSearchParams();
  if (filters.subject && filters.subject !== 'All') params.append('subject', filters.subject);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.difficulty && filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
  if (filters.search) params.append('search', filters.search);

  const res = await api.get(`/questions?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createQuestion = async (data, token) => {
  const res = await api.post('/questions', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const bulkUploadQuestions = async (formData, token) => {
  const res = await api.post('/questions/bulk', formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const deleteQuestion = async (id, token) => {
  const res = await api.delete(`/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// TESTS
export const getTests = async (filters, token) => {
  const params = new URLSearchParams();
  if (filters.testType && filters.testType !== 'All') params.append('testType', filters.testType);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.subject && filters.subject !== 'All') params.append('subject', filters.subject);
  if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished);

  const res = await api.get(`/tests?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getTestById = async (id, token) => {
  const res = await api.get(`/tests/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createTest = async (data, token) => {
  const res = await api.post('/tests', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateTest = async (id, data, token) => {
  const res = await api.put(`/tests/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteTest = async (id, token) => {
  const res = await api.delete(`/tests/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// ATTEMPTS
export const submitTest = async (data, token) => {
  const res = await api.post('/test-attempts', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMyAttempts = async (token) => {
  const res = await api.get('/test-attempts/my-attempts', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAttemptDetails = async (id, token) => {
  const res = await api.get(`/test-attempts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
