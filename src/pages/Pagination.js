import React from 'react';

const Pagination = ({ total, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages === 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      {pages.map((page) => (
        <button
          key={page}
          disabled={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
