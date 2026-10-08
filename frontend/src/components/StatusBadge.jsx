import React from 'react';

const statusStyles = {
  pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
  in_progress: { bg: '#dbeafe', text: '#1e40af', label: 'In Progress' },
  completed: { bg: '#dcfce7', text: '#166534', label: 'Completed' },
  cancelled: { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' },
  todo: { bg: '#f1f5f9', text: '#475569', label: 'To Do' },
  in_review: { bg: '#f3e8ff', text: '#6b21a8', label: 'In Review' },
};

export const StatusBadge = ({ status }) => {
  const normalized = status ? status.toLowerCase() : 'pending';
  const config = statusStyles[normalized] || {
    bg: '#f1f5f9',
    text: '#475569',
    label: status,
  };

  return (
    <span
      className="badge rounded-pill fw-semibold px-2 py-1"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontSize: '0.78rem',
      }}
    >
      {config.label}
    </span>
  );
};
