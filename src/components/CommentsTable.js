import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const CommentsTable = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api.get('/api/comments/')
      .then((response) => {
        console.log('Fetched comments:', response.data); // Лог для перевірки
        const mainComments = response.data.filter(comment => comment.parent === null); // Головні коментарі
        setComments(mainComments);
      })
      .catch((error) => console.error('Error fetching comments:', error));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
          <th>Text</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.id}>
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
