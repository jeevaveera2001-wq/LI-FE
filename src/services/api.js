import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://li-be.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTournaments = async () => {
  try {
    const res = await api.get('/tournaments');
    return res.data;
  } catch (err) {
    console.error('Error fetching tournaments:', err);
    return [];
  }
};

export const getGames = async () => {
  try {
    const res = await api.get('/games');
    return res.data;
  } catch (err) {
    console.error('Error fetching games:', err);
    return [];
  }
};

export const getNews = async () => {
  try {
    const res = await api.get('/news');
    return res.data;
  } catch (err) {
    console.error('Error fetching news:', err);
    return [];
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (err) {
    console.error('Error registering user:', err);
    throw err;
  }
};

export default api;
