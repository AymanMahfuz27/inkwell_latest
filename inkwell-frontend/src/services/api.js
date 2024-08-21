// services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://inkwell-backend-291a1781d750.herokuapp.com';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Check if the request is for a public endpoint (list or retrieve books)
        const isPublicEndpoint = originalRequest.url.includes('/books/') && originalRequest.method === 'get';

        if (error.response.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Handle session expiration: clear tokens and redirect to login page
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; // or handle it however your app handles session expiration
                return Promise.reject(refreshError);
            }
        }

        // If it's a public endpoint and the request failed, let it proceed without retrying
        if (isPublicEndpoint) {
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
