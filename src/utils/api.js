import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Базовий URL для API
});

// Додаємо інтерсептор для передачі токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Отримуємо токен із localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Додаємо заголовок Authorization
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
