// authService.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// const API_URL = 'http://localhost:8000/api';
const API_URL = process.env.REACT_APP_API_URL + '/api';
export const login = async (username, password) => {
try {
  const response = await axios.post(`${API_URL}/token/`, { username, password });
  const { access, refresh } = response.data;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  const user = jwtDecode(access);
  localStorage.setItem('user_first_name', user.first_name);

} catch (error) {
    console.error("Login failed. Error:", error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  await axios.post(`${API_URL}/users/`, { username, email, password });
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  const { exp } = jwtDecode(token);
  return Date.now() < exp * 1000;
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const getUserFirstName = () => localStorage.getItem('user_first_name');