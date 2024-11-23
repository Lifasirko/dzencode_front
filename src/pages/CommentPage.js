import React from 'react';
import { useParams } from 'react-router-dom';
import CommentThread from '../components/CommentThread';

const CommentPage = () => {
  const { id } = useParams(); // Отримання ID коментаря з URL

  return (
    <div>
      <h1>Comment Thread</h1>
      <CommentThread parentId={id} />
    </div>
  );
};

export default CommentPage;
