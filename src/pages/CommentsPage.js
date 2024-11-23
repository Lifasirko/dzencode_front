import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentsTable from './CommentsTable';
import Pagination from './Pagination';
import { getAuthToken } from '../utils/auth';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchComments = async (page = 1) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`http://127.0.0.1:8000/api/comments/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);

  return (
    <div>
      <h1>Comments</h1>
      <CommentsTable comments={comments} />
      <Pagination
        total={count}
        pageSize={25}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default CommentsPage;
