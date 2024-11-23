import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', credentials);
      localStorage.setItem('authToken', response.data.access);
      alert('Login successful!');
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
