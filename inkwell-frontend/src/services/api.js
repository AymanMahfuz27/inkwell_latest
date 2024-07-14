import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
const apiUrl = 'https://359265b8-6edd-406f-b3a3-e869fcb2ecf8-dev.e1-us-east-azure.choreoapis.dev/inkwell/backend/v1'
const api = axios.create({
    baseURL: process.env.VITE_API_URL ? process.env.VITE_API_URL : apiUrl
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

export default api;