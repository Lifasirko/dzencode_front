import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('Sending credentials:', credentials); // Логін відправлених даних
    const response = await axios.post('http://127.0.0.1:8000/api/token/', credentials, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Response received:', response.status, response.data); // Логін отриманих даних
    if (response.status === 200) {
      localStorage.setItem('authToken', response.data.access);
      alert('Login successful!');
    } else {
      setErrorMessage('Invalid username or password.');
    }
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    setErrorMessage('Invalid username or password.');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
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

export default LoginPage;
