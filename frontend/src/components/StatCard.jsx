import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = '#4f46e5', subtext }) => {
  return (
    <div className="card border-0 shadow-card bg-white rounded-3 h-100 p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="text-muted text-uppercase mb-1 fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            {title}
          </p>
          <h3 className="fw-bold mb-0 text-dark">{value}</h3>
          {subtext && (
            <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.78rem' }}>
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="d-flex align-items-center justify-content-center rounded-3 p-2"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};
