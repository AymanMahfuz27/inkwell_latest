// services/api.js
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'https://inkwell-backend-291a1781d750.herokuapp.com';

const api = axios.create({
    baseURL: API_URL
});

// List of public routes that don't require authentication
const publicRoutes = ['/api/books/books/$'];

api.interceptors.request.use(
    config => {
        // Skip adding token for public routes
        if (publicRoutes.some(route => config.url.includes(route))) {
            return config;
        }

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

        // Skip token refresh for public routes
        if (publicRoutes.some(route => originalRequest.url.includes(route))) {
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // If no refresh token, reject the promise
                    return Promise.reject(error);
                }
                const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
                const { access } = response.data;
                localStorage.setItem('access_token', access);
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Clear tokens if refresh fails
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;