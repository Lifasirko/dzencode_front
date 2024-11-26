import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CommentModal from '../components/modals/CommentModal';
import LoginModal from '../components/modals/LoginModal';

const HomePage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    const fetchTopics = async () => {
      try {
        const response = await api.get('/api/parent-comments/');
        setTopics(response.data.results || []);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Головна сторінка</h1>
        <div>
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                setIsLoggedIn(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Вийти
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Увійти
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id} className="mb-4">
              <h2 className="text-lg font-bold">{topic.user_name}</h2>
              <p>{topic.text}</p>
              <button
                onClick={() => navigate(`/comments/${topic.id}`)}
                className="text-blue-500 underline"
              >
                Переглянути
              </button>
            </li>
          ))}
        </ul>
      )}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showCommentModal && <CommentModal onClose={() => setShowCommentModal(false)} />}
    </div>
  );
};

export default HomePage;
