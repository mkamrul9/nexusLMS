import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Intercept requests to attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or extract from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (status === 400) {
        // Bad Request - often validation errors from ASP.NET Core
        console.error('Validation Error:', error.response.data);
        alert(error.response.data.message || 'Invalid data submitted.');
      } else if (status === 500) {
        // Internal Server Error
        console.error('Server Error:', error.response.data);
        alert(`Server Error: ${error.response.data.details || 'Internal server error occurred.'}`);
      } else {
        alert(`Error: ${status}. Please try again.`);
      }
    } else {
      alert('Network error. Please check your connection to the server.');
    }
    return Promise.reject(error);
  }
);

export default api;
