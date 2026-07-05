import api from './api';

export const getTools = async () => {
  const response = await api.get('/tools');
  return response.data;
};

export const createTool = async (payload) => {
  const response = await api.post('/tools', payload);
  return response.data;
};

export const updateTool = async (id, payload) => {
  const response = await api.put(`/tools/${id}`, payload);
  return response.data;
};

export const deleteTool = async (id) => {
  const response = await api.delete(`/tools/${id}`);
  return response.data;
};

export const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
