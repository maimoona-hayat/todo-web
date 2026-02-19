import React from 'react';

function Pagination({ total, page, onPageChange }) {
  const totalPages = Math.ceil(total / 6);
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <span className="material-icons">chevron_left</span>
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i + 1} onClick={() => onPageChange(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <span className="material-icons">chevron_right</span>
      </button>
    </div>
  );
}

export default Pagination;