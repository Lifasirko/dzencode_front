import React, { useState } from 'react';
import api from '../utils/api';

const CommentForm = ({ parentId = null }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    text: '',
    parent_id: parentId,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/comments/', formData) // Використовуємо api.js
      .then(() => {
        alert('Comment added!');
        setFormData({ user_name: '', email: '', text: '', parent_id: parentId });
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>User Name:</label>
        <input name="user_name" value={formData.user_name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Text:</label>
        <textarea name="text" value={formData.text} onChange={handleChange} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
