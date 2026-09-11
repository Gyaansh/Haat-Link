import { request } from './api.js';

export const getOffers = () => request('/offers');

export const createOffer = (offer) =>
  request('/offers', {
    method: 'POST',
    body: JSON.stringify(offer),
  });
