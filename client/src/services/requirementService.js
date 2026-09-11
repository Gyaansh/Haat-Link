import { request } from './api.js';

export const getRequirements = () => request('/requirements');

export const createRequirement = (requirement) =>
  request('/requirements', {
    method: 'POST',
    body: JSON.stringify(requirement),
  });
