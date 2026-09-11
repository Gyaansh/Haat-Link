import { request } from './api.js';

export async function registerUser(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function logoutUser() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser() {
  return request('/auth/me');
}
