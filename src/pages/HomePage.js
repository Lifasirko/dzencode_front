import React from 'react';
import CommentsTable from '../components/CommentsTable';
import CommentForm from '../components/CommentForm';
import { isAuthenticated, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isAuthenticated()) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <h1>Main Comments</h1>
      <button onClick={handleLoginClick}>
        {isAuthenticated() ? 'Logout' : 'Login'}
      </button>
      <CommentForm />
      <CommentsTable />
    </div>
  );
};

export default HomePage;
