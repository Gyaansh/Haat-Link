import { request } from './api.js';

/**
 * Fetch all buyers, optionally filtered by crop name.
 * @param {string} [crop] - Optional crop name to filter buyers.
 */
export const getBuyers = (crop) => {
  const query = crop ? `?crop=${encodeURIComponent(crop)}` : '';
  return request(`/buyers${query}`);
};
