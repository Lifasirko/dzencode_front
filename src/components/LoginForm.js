import React, { useState } from 'react';
import api from '../utils/api'; // Імпортуємо налаштований axios

const LoginForm = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/token/', credentials) // Використовуємо api.js
      .then((response) => {
        localStorage.setItem('token', response.data.access);
        onSuccess();
      })
      .catch((error) => console.error('Login failed:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input name="username" value={credentials.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
