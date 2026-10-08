import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const AlertBanner = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const icons = {
    danger: <AlertCircle size={18} className="me-2 text-danger flex-shrink-0" />,
    success: <CheckCircle2 size={18} className="me-2 text-success flex-shrink-0" />,
    info: <Info size={18} className="me-2 text-primary flex-shrink-0" />,
  };

  const bgClasses = {
    danger: 'bg-danger-subtle text-danger-emphasis border-danger-subtle',
    success: 'bg-success-subtle text-success-emphasis border-success-subtle',
    info: 'bg-primary-subtle text-primary-emphasis border-primary-subtle',
  };

  return (
    <div
      className={`alert border d-flex align-items-center justify-content-between p-3 rounded-3 mb-3 ${
        bgClasses[type] || bgClasses.danger
      }`}
      role="alert"
    >
      <div className="d-flex align-items-center">
        {icons[type]}
        <div style={{ fontSize: '0.88rem' }}>{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close ms-2"
          aria-label="Close"
          onClick={onClose}
          style={{ fontSize: '0.75rem' }}
        />
      )}
    </div>
  );
};
