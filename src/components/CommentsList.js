import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentsTable from './CommentsTable';

const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/comments/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          setComments(response.data);
        } else {
          throw new Error('Unexpected API response format');
        }

        setError('');
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      {comments.length > 0 ? (
        <CommentsTable comments={comments} />
      ) : (
        <p>No comments available.</p>
      )}
    </>
  );
};

export default CommentsList;
