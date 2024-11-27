import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Для очищення HTML
import api from '../utils/api';
import CommentModal from '../components/modals/CommentModal';
import LoginModal from '../components/modals/LoginModal';

const HomePage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/parent-comments/', {
          params: {
            page: currentPage,
            ordering: `${sortOrder === 'desc' ? '-' : ''}${sortField}`,
          },
        });
        setTopics(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / 25));
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [currentPage, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['a', 'code', 'i', 'strong'], ALLOWED_ATTR: ['href', 'title'] });
  };

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
          <button
            onClick={() => setShowCommentModal(true)}
            className="bg-secondary text-white px-4 py-2 rounded ml-2"
          >
            Створити топік
          </button>
        </div>
      </div>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th
                  onClick={() => handleSort('user_name')}
                  className="border border-gray-300 px-4 py-2 cursor-pointer"
                >
                  Ім'я користувача {sortField === 'user_name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="border border-gray-300 px-4 py-2 cursor-pointer"
                >
                  Email {sortField === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('created_at')}
                  className="border border-gray-300 px-4 py-2 cursor-pointer"
                >
                  Дата додавання {sortField === 'created_at' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="border border-gray-300 px-4 py-2">Текст топіка</th>
                <th className="border border-gray-300 px-4 py-2">Дії</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{topic.user_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{topic.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(topic.created_at).toLocaleString()} {/* Використовуємо created_at */}
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(topic.text) }}
                  ></td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => navigate(`/comments/${topic.id}`)}
                      className="text-blue-500 underline"
                    >
                      Переглянути
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
            >
              Попередня
            </button>
            <p>
              Сторінка {currentPage} з {totalPages}
            </p>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
            >
              Наступна
            </button>
          </div>
        </>
      )}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showCommentModal && <CommentModal onClose={() => setShowCommentModal(false)} />}
    </div>
  );
};

export default HomePage;
