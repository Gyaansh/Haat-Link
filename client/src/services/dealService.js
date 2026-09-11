import { request } from './api.js';

export const getDeals = () => request('/deals');

export const createDeal = (deal) =>
  request('/deals', {
    method: 'POST',
    body: JSON.stringify(deal),
  });
