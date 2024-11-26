import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import placeholderAvatar from '../assets/placeholder-avatar.png'; // Заглушка для аватарки

const TopicPage = () => {
  const { topicId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null); // Відстежуємо коментар, для якого показуємо форму відповіді
  const [replyText, setReplyText] = useState(''); // Текст відповіді

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/comments/${topicId}/`);
        setComments(response.data.children || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [topicId]);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      alert('Текст відповіді не може бути порожнім');
      return;
    }
    try {
      const response = await api.post('/api/comments/', {
        text: replyText,
        parent: replyTo, // Ідентифікатор коментаря, до якого додаємо відповідь
        user_name: 'Анонім', // Замініть на реальне ім'я
        email: 'your_email@example.com', // Замініть на реальний email
        home_page: '', // Можете додати логіку для заповнення цього поля
      });
      console.log('Відповідь успішно додана:', response.data);
      setReplyText(''); // Очищаємо текст відповіді
      setReplyTo(null); // Скидаємо стан після успішного додавання
      // Оновлення списку коментарів
      const updatedResponse = await api.get(`/api/comments/${topicId}/`);
      setComments(updatedResponse.data.children || []);
    } catch (error) {
      console.error('Помилка додавання відповіді:', error);
      alert('Не вдалося додати відповідь. Спробуйте пізніше.');
    }
  };

  const renderComments = (commentsList) => {
    return (
      <ul className="pl-4">
        {commentsList.map((comment) => (
          <li key={comment.id} className="mb-4 border-b pb-4">
            {/* Верхня частина коментаря */}
            <div className="flex items-center mb-2">
              {/* Аватарка */}
              <img
                src={comment.avatar || placeholderAvatar}
                alt="Аватар коментатора"
                style={{
                  width: '3em',
                  height: '3em',
                  borderRadius: '50%',
                  marginRight: '1rem',
                }}
              />
              {/* Інформація про коментар */}
              <div className="flex-1">
                <h4 className="text-lg font-bold">{comment.user_name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(comment.date_added).toLocaleString()}
                </p>
              </div>
              {/* Рейтинг */}
              <div className="flex items-center">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => console.log('Upvote', comment.id)}
                >
                  ▲
                </button>
                <span className="mx-2">{comment.rating || 0}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => console.log('Downvote', comment.id)}
                >
                  ▼
                </button>
              </div>
            </div>
            {/* Текст коментаря */}
            <p>{comment.text}</p>
            {/* Кнопка відповіді */}
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="text-blue-500 underline mt-2"
            >
              {replyTo === comment.id ? 'Скасувати відповідь' : 'Відповісти'}
            </button>
            {/* Форма відповіді */}
            {replyTo === comment.id && (
              <div className="mt-4">
                <textarea
                  placeholder="Напишіть вашу відповідь"
                  className="w-full border border-gray-300 rounded p-2 mb-2"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleReplySubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Додати відповідь
                  </button>
                </div>
              </div>
            )}
            {/* Рекурсивно відображаємо дочірні коментарі */}
            {comment.children && comment.children.length > 0 && renderComments(comment.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Коментарі до теми</h1>
      </div>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div>{renderComments(comments)}</div>
      )}
    </div>
  );
};

export default TopicPage;
