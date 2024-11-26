import React, { useState } from 'react';
import api from '../../utils/api';

const CommentModal = ({ parentId, onClose, onCommentAdded }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    home_page: '',
    text: '',
    parent: parentId || null,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError(''); // Очищення попередніх помилок

    if (!formData.user_name.trim() || !formData.email.trim() || !formData.text.trim()) {
      setError('Усі обов’язкові поля повинні бути заповнені.');
      return;
    }

    try {
      console.log('Відправлення запиту:', formData); // Логування даних перед запитом
      const response = await api.post('/api/comments/', formData);
      console.log('Успішна відповідь:', response); // Логування відповіді бекенду
      if (response.status === 201) {
        console.log('Коментар створено успішно.');
        onCommentAdded(); // Оновлення списку коментарів
        onClose(); // Закриття модального вікна
      } else {
        setError('Сталася помилка при створенні коментаря.');
      }
    } catch (err) {
      console.error('Помилка додавання коментаря:', err); // Логування помилки
      setError('Не вдалося додати коментар. Спробуйте пізніше.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Відповісти на коментар</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form className="space-y-4">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
              Ім'я
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="home_page" className="block text-sm font-medium text-gray-700">
              Домашня сторінка (необов’язково)
            </label>
            <input
              type="url"
              id="home_page"
              name="home_page"
              value={formData.home_page}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Текст коментаря
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              rows="4"
              required
            ></textarea>
          </div>
        </form>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Відповісти
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
