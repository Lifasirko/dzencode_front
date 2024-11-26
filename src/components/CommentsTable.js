import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CommentsTable = () => {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/comments/')
      .then((response) => {
        console.log('Fetched comments:', response.data); // Лог для перевірки
        const mainComments = response.data.filter(comment => comment.parent === null); // Головні коментарі
        setComments(mainComments);
      })
      .catch((error) => console.error('Error fetching comments:', error));
  }, []);

  const handleRowClick = (commentId) => {
    navigate(`/comments/${commentId}`); // Перехід на сторінку з відповідями
  };

  return (
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
          <th>Text</th>
          <th>Home Page</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.id} onClick={() => handleRowClick(comment.id)} style={{ cursor: 'pointer' }}>
            <td>{comment.user_name}</td>
            <td>{comment.email}</td>
            <td>{comment.text}</td>
            <td>{comment.home_page || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommentsTable;
