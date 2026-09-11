import { request } from './api.js';

export const getCrops = () => request('/crops');

export const getCropTypes = () => request('/crops/types');

export const createCrop = (crop) =>
  request('/crops', {
    method: 'POST',
    body: JSON.stringify(crop),
  });

export const updateCrop = (id, patch) =>
  request(`/crops/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });

export const deleteCrop = (id) => request(`/crops/${id}`, { method: 'DELETE' });
