import { request } from './api.js';

/** Fetch aggregated dashboard stats (crop count, deal count, notifications). */
export const getDashboardStats = () => request('/dashboard');
