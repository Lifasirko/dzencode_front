import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Увійти</h1>
      <LoginForm onSuccess={() => window.location.href = '/'} />
    </div>
  );
};

export default LoginPage;
