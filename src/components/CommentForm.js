import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    home_page: '',
    text: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://127.0.0.1:8000/api/comments/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Comment added successfully!');
      setFormData({ user_name: '', email: '', home_page: '', text: '' });
      setError('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>User Name:</label>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Home Page:</label>
        <input
          type="url"
          name="home_page"
          value={formData.home_page}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Text:</label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default CommentForm;
