import React, { useState } from 'react';
import api from '../../utils/api';

const LoginModal = ({ onClose }) => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/token/', { username, password });
      const { access } = response.data;

      // Зберігаємо токен у localStorage
      localStorage.setItem('accessToken', access);
      onClose(); // Закриваємо модальне вікно
      window.location.reload(); // Перезавантажуємо сторінку, щоб токен додався до запитів
    } catch (err) {
      setError('Невірний логін або пароль');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Увійти</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="username"
              className="w-full border border-gray-300 p-2 rounded"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-4">
              Скасувати
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Увійти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
