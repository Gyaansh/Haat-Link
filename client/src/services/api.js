/**
 * api.js — central API client for HaatLink frontend.
 *
 * All requests to the backend go through this module.
 * Never scatter localhost URLs in page components.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Thin fetch wrapper. Throws an Error with the server message on non-2xx responses.
 */
export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data.message || `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return data;
}
