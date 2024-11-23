import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

const CommentThread = ({ parentId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/api/comments/${parentId}/replies/`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error('Error fetching replies:', error));
  }, [parentId]);

  return (
    <div>
      <h3>Thread for Comment ID: {parentId}</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.user_name}</strong>: {comment.text}
          </li>
        ))}
      </ul>
      <h4>Reply to this comment:</h4>
      <CommentForm parentId={parentId} />
    </div>
  );
};

export default CommentThread;
