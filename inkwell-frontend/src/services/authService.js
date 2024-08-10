// authService.js
import axios from 'axios';
import {jwtDecode}  from 'jwt-decode';
import api from './api';

const API_URL = process.env.REACT_APP_API_URL + '/api' || 'http://localhost:8000/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login/`, { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    const decodedToken = jwtDecode(access);
    console.log('Decoded token:', decodedToken); // Debugging line
    localStorage.setItem('username', decodedToken.username || username);
    localStorage.setItem('user_first_name', decodedToken.first_name || '');
    window.dispatchEvent(new Event('storage'));

    return decodedToken;
  } catch (error) {
    console.error("Login failed. Error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_first_name');
  localStorage.removeItem('username');
  window.dispatchEvent(new Event('storage'));

};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  const { exp } = jwtDecode(token);
  return Date.now() < exp * 1000;
};

export const getUsername = () => {
  return localStorage.getItem('username') || null;
};

export const getUserFirstName = () => {
  return localStorage.getItem('user_first_name') || null;
};

export const followUser = async (username) => {
  try {
    const response = await api.post(`/api/users/profiles/${username}/follow/`);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (username) => {
  try {
    const response = await api.post(`/api/users/profiles/${username}/unfollow/`);
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const getFollowers = async (username) => {
  try {
    const response = await api.get(`/api/users/profiles/${username}/followers/`);
    return response.data;
  } catch (error) {
    console.error('Error getting followers:', error);
    throw error;
  }
};

export const getFollowing = async (username) => {
  try {
    const response = await api.get(`/api/users/profiles/${username}/following/`);
    return response.data;
  } catch (error) {
    console.error('Error getting following:', error);
    throw error;
  }
};




export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');