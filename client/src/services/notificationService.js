import { request } from './api.js';

export const getNotifications = () => request('/notifications');
