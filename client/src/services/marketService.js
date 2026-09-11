import { request } from './api.js';

/** Fetch all crop market records. */
export const getMarkets = () => request('/markets');

/** Fetch market data for a specific crop name. */
export const getMarketByCrop = (crop) =>
  request(`/markets/${encodeURIComponent(crop)}`);
