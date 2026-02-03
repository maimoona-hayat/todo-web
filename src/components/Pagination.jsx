import React from 'react';

function Pagination({ total, page, onPageChange }) {
  const totalPages = Math.ceil(total / 10);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '5px' }}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;