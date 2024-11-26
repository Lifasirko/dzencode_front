import React, { useState } from 'react';
import CommentCard from './CommentCard';
import CommentModal from './modals/CommentModal';

const CommentTree = ({ comments, depth = 0, onCommentAdded }) => {
  const [replyTo, setReplyTo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleReplyClick = (commentId) => {
    setReplyTo(commentId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setReplyTo(null);
  };

  if (!comments || comments.length === 0) return null;

  return (
    <div>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{ marginLeft: `${depth * 20}px` }} // Відступ залежно від рівня
          className="mb-4"
        >
          <CommentCard
            userName={comment.user_name}
            text={comment.text}
            date={comment.date_added || 'Невідома дата'}
            onReply={() => handleReplyClick(comment.id)}
          />
          {/* Рекурсивно відображаємо дочірні коментарі */}
          {comment.children && (
            <CommentTree
              comments={comment.children}
              depth={depth + 1}
              onCommentAdded={onCommentAdded}
            />
          )}
        </div>
      ))}
      {/* Модальне вікно */}
      {showModal && (
        <CommentModal
          parentId={replyTo}
          onClose={handleModalClose}
          onCommentAdded={onCommentAdded}
        />
      )}
    </div>
  );
};

export default CommentTree;
