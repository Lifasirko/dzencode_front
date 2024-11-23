import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const handleLoginSuccess = () => {
    window.location.href = '/'; // Повернення на головну сторінку після логіну
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
