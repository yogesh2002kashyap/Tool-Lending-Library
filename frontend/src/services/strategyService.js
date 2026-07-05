import api from './api';

export const getStrategies = async () => {
  const response = await api.get('/strategies');
  return response.data;
};

export const createStrategy = async (payload) => {
  const response = await api.post('/strategies', payload);
  return response.data;
};

export const updateStrategy = async (id, payload) => {
  const response = await api.put(`/strategies/${id}`, payload);
  return response.data;
};

export const deleteStrategy = async (id) => {
  const response = await api.delete(`/strategies/${id}`);
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
