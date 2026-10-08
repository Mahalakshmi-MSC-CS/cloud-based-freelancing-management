import React from 'react';

export const ProgressBar = ({ progress = 0, showLabel = true, height = 8 }) => {
  const percentage = Math.min(100, Math.max(0, Math.round(progress)));

  let color = '#4f46e5';
  if (percentage === 100) color = '#10b981';
  else if (percentage < 30) color = '#f59e0b';

  return (
    <div className="w-100">
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>Progress</span>
          <span className="fw-bold" style={{ fontSize: '0.78rem', color }}>{percentage}%</span>
        </div>
      )}
      <div
        className="progress bg-light"
        style={{ height: `${height}px`, borderRadius: '999px', overflow: 'hidden' }}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            transition: 'width 0.4s ease',
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};
