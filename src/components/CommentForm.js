import React, { useState } from 'react';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

const CommentTree = ({ comments, depth = 0, onCommentAdded }) => {
  const [replyTo, setReplyTo] = useState(null); // ID коментаря, на який відповідають

  const handleReplyClick = (commentId) => {
    setReplyTo((prev) => (prev === commentId ? null : commentId)); // Перемикач форми
  };

  if (!comments || comments.length === 0) return null;

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          style={{ marginLeft: `${depth * 20}px` }} // Відступ залежно від рівня вкладеності
          className="border-l-2 pl-4"
        >
          <CommentCard
            userName={comment.user_name}
            text={comment.text}
            date={comment.date_added || 'Невідома дата'}
            onReply={() => handleReplyClick(comment.id)} // Відкриття форми відповіді
          />
          {/* Форма відповіді */}
          {replyTo === comment.id && (
            <CommentForm
              parentId={comment.id}
              onCommentAdded={() => {
                onCommentAdded();
                setReplyTo(null); // Закрити форму після додавання
              }}
            />
          )}
          {/* Рекурсивно відображаємо дочірні коментарі */}
          {comment.children && (
            <CommentTree
              comments={comment.children}
              depth={depth + 1}
              onCommentAdded={onCommentAdded}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommentTree;
