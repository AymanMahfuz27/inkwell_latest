// services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://359265b8-6edd-406f-b3a3-e869fcb2ecf8-dev.e1-us-east-azure.choreoapis.dev/inkwell/backend/v1';

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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
                const { access } = response.data;
                localStorage.setItem('access_token', access);
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Redirect to login page or handle session expiration
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;