import { request } from './api.js';

export const getRequirements = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(query ? `/requirements?${query}` : '/requirements');
};

export const createRequirement = (requirement) =>
  request('/requirements', {
    method: 'POST',
    body: JSON.stringify(requirement),
  });
