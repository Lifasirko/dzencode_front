import React from 'react';

const CommentsTable = ({ comments }) => {
  if (!Array.isArray(comments)) {
    console.error('Comments data is not an array:', comments);
    return <p>Error displaying comments.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
          <th>Home Page</th>
          <th>Text</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.id}>
            <td>{comment.user_name}</td>
            <td>{comment.email}</td>
            <td>
              {comment.home_page ? (
                <a href={comment.home_page} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              ) : (
                'N/A'
              )}
            </td>
            <td>{comment.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommentsTable;
