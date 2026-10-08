import React from 'react';

const priorityStyles = {
  low: { bg: '#e2e8f0', text: '#334155', label: 'Low' },
  medium: { bg: '#e0f2fe', text: '#0369a1', label: 'Medium' },
  high: { bg: '#ffedd5', text: '#c2410c', label: 'High' },
  urgent: { bg: '#ffe4e6', text: '#be123c', label: 'Urgent' },
};

export const PriorityBadge = ({ priority }) => {
  const normalized = priority ? priority.toLowerCase() : 'medium';
  const config = priorityStyles[normalized] || {
    bg: '#f1f5f9',
    text: '#475569',
    label: priority,
  };

  return (
    <span
      className="badge rounded-pill fw-semibold px-2 py-1"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontSize: '0.75rem',
      }}
    >
      {config.label}
    </span>
  );
};
