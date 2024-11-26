import React from 'react';

const CommentCard = ({ userName, text, date, onReply }) => (
  <div className="bg-gray-100 p-4 rounded shadow border">
    <h4 className="text-lg font-bold">{userName}</h4>
    <p className="text-gray-700">{text}</p>
    <span className="text-sm text-gray-500">{date}</span>
    <div className="mt-2">
      <button
        onClick={onReply}
        className="text-blue-500 hover:underline text-sm"
      >
        Переглянути
      </button>
    </div>
  </div>
);

export default CommentCard;
