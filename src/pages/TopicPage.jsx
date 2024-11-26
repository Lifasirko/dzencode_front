import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import api from '../utils/api';
import placeholderAvatar from '../assets/placeholder-avatar.png';

// Функція для екранування HTML
const escapeHTML = (html) => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Функція для очищення HTML
const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'code', 'i', 'strong'],
    ALLOWED_ATTR: ['href', 'title'],
  });
};

const TopicPage = () => {
  const { topicId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef(null);

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
        parent: replyTo,
        user_name: localStorage.getItem('user_name') || 'Анонім',
        email: 'your_email@example.com',
        home_page: '',
      });
      console.log('Відповідь успішно додана:', response.data);
      setReplyText('');
      setReplyTo(null);
      const updatedResponse = await api.get(`/api/comments/${topicId}/`);
      setComments(updatedResponse.data.children || []);
    } catch (error) {
      console.error('Помилка додавання відповіді:', error);
      alert('Не вдалося додати відповідь. Спробуйте пізніше.');
    }
  };

  const addTagToText = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);

    let wrappedText = '';
    if (tag === 'a') {
      wrappedText = `<a href="" title="">${selectedText || 'посилання'}</a>`;
    } else if (tag === 'code') {
      wrappedText = `<code>${escapeHTML(selectedText || 'код')}</code>`;
    } else {
      wrappedText = `<${tag}>${selectedText}</${tag}>`;
    }

    const newText = `${before}${wrappedText}${after}`;
    setReplyText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(before.length + wrappedText.length, before.length + wrappedText.length);
    }, 0);
  };

  const renderComments = (commentsList) => {
    return (
      <ul className="pl-4">
        {commentsList.map((comment) => (
          <li key={comment.id} className="mb-4 border-b pb-4">
            <div className="flex items-center mb-2">
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
              <div className="flex-1">
                <h4 className="text-lg font-bold">{sanitizeHTML(comment.user_name)}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(comment.date_added).toLocaleString()}
                </p>
              </div>
            </div>
            <p
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(comment.text).replace(
                  /<code>(.*?)<\/code>/g,
                  (_, code) => `<code>${escapeHTML(code)}</code>`
                ),
              }}
            ></p>
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="text-blue-500 underline mt-2"
            >
              {replyTo === comment.id ? 'Скасувати відповідь' : 'Відповісти'}
            </button>
            {replyTo === comment.id && (
              <div className="mt-4">
                {/* Панель тегів */}
                <div className="mb-2 flex space-x-2">
                  <button
                    onClick={() => addTagToText('strong')}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => addTagToText('i')}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    <i>I</i>
                  </button>
                  <button
                    onClick={() => addTagToText('code')}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Code
                  </button>
                  <button
                    onClick={() => addTagToText('a')}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Link
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
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
