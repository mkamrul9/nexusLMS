import axios from 'axios';

/**
 * Pre-configured Axios instance for all NexusLMS API calls.
 * Automatically attaches the JWT Bearer token from localStorage to every request,
 * and handles common error scenarios (401 → redirect to login, 400/500 → console log).
 *
 * Base URL is read from the NEXT_PUBLIC_API_URL environment variable,
 * falling back to localhost:5000 for local development.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the stored JWT access token to the Authorization header on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Centralised error handling — prevents repetitive try/catch in every component
api.interceptors.response.use(
  (response) => response, // Pass successful responses through unchanged
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Token expired or invalid — clear storage and redirect to login
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (status === 400) {
        // Validation error from ASP.NET Core ModelState
        console.error('Validation Error:', error.response.data);
      } else if (status === 500) {
        // Internal server error
        console.error('Server Error:', error.response.data);
      } else {
        console.error(`Unexpected Error ${status}. Please try again.`);
      }
    } else {
      // Network-level error (no response received — server unreachable)
      console.error('Network error. Please check your connection to the API server.');
    }

    return Promise.reject(error);
  }
);

export default api;
