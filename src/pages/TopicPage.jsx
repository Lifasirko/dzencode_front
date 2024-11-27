import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Resizer from 'react-image-file-resizer';
import placeholderAvatar from '../assets/placeholder-avatar.png';
import CaptchaComponent from '../components/CaptchaComponent';
import api from '../utils/api';

const escapeHTML = (html) => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'code', 'i', 'strong'],
    ALLOWED_ATTR: ['href', 'title'],
  });
};

const processCodeTags = (html) => {
  return html.replace(/<code>(.*?)<\/code>/gs, (_, codeContent) => {
    const escapedCode = escapeHTML(codeContent);
    return `<code style="white-space: pre-wrap; font-family: monospace; background: #f5f5f5; padding: 0.5em; border-radius: 4px; line-height: 1.8;">${escapedCode}</code>`;
  });
};

const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const textareaRef = useRef(null);

  const COMMENTS_PER_PAGE = 25;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/comments/${topicId}/`, {
          params: { page: currentPage },
        });
        setComments(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / COMMENTS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [topicId, currentPage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        Resizer.imageFileResizer(
          file,
          320,
          240,
          'JPEG',
          100,
          0,
          (uri) => {
            setSelectedFile({ name: file.name, type: file.type, data: uri });
          },
          'base64'
        );
      } else if (file.type === 'text/plain') {
        if (file.size > 102400) {
          alert('Текстовий файл має бути меншим за 100 КБ');
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            setSelectedFile({ name: file.name, type: file.type, data: event.target.result });
          };
          reader.readAsText(file);
        }
      } else {
        alert('Підтримуються лише зображення (JPG, PNG, GIF) або текстові файли (TXT)');
      }
    }
  };

  const handleReplySubmit = async () => {
    if (!captchaVerified) {
      alert('Вам потрібно пройти CAPTCHA.');
      return;
    }

    if (!replyText.trim()) {
      alert('Текст відповіді не може бути порожнім');
      return;
    }

    const sanitizedText = replyText.replace(
      /<code>(.*?)<\/code>/g,
      (_, codeContent) => `<code>${escapeHTML(codeContent)}</code>`
    );

    const formData = new FormData();
    formData.append('text', sanitizedText);
    formData.append('parent', replyTo);
    formData.append('user_name', localStorage.getItem('user_name') || 'Анонім');
    formData.append('email', 'your_email@example.com');
    formData.append('home_page', '');

    if (selectedFile) {
      formData.append('file', selectedFile.data);
    }

    try {
      await api.post('/api/comments/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setReplyText('');
      setReplyTo(null);
      setSelectedFile(null);
      setCaptchaVerified(false);
      const updatedResponse = await api.get(`/api/comments/${topicId}/`, {
        params: { page: currentPage },
      });
      setComments(updatedResponse.data.results || []);
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
      wrappedText = `<code>${selectedText || 'код'}</code>`;
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
    if (!commentsList.length) {
      return <p>Коментарів поки немає.</p>;
    }

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
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <p
              dangerouslySetInnerHTML={{
                __html: processCodeTags(sanitizeHTML(comment.text)),
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
                <input type="file" onChange={handleFileChange} className="mb-2" />
                {selectedFile && (
                  <p>
                    Завантажено файл: <strong>{selectedFile.name}</strong>
                  </p>
                )}
                <CaptchaComponent onVerify={setCaptchaVerified} />
                <div className="flex justify-end">
                  <button
                    onClick={handleReplySubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={!captchaVerified}
                  >
                    Додати відповідь
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Коментарі до теми</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Додому
        </button>
      </div>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <>
          {renderComments(comments)}
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
    </div>
  );
};

export default TopicPage;
