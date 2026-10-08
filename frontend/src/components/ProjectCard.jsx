import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Calendar, DollarSign, UserCheck, ArrowRight } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  return (
    <div className="card border-0 shadow-card bg-white rounded-3 h-100 d-flex flex-column p-4">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h5 className="fw-bold text-dark text-truncate mb-0" style={{ maxWidth: '70%' }}>
          {project.title}
        </h5>
        <StatusBadge status={project.status} />
      </div>

      <p className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>
        {project.description}
      </p>

      <div className="mb-3">
        <ProgressBar progress={project.progress_percentage || 0} />
        <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: '0.75rem' }}>
          <span>Tasks: {project.completed_tasks || 0} / {project.total_tasks || 0} completed</span>
        </div>
      </div>

      <div className="pt-3 border-top border-subtle d-flex flex-column gap-2 mb-3" style={{ fontSize: '0.82rem' }}>
        <div className="d-flex justify-content-between text-secondary">
          <span className="d-flex align-items-center gap-1">
            <DollarSign size={15} className="text-success" /> Budget:
          </span>
          <span className="fw-bold text-dark">${parseFloat(project.budget || 0).toLocaleString()}</span>
        </div>

        <div className="d-flex justify-content-between text-secondary">
          <span className="d-flex align-items-center gap-1">
            <Calendar size={15} className="text-primary" /> Deadline:
          </span>
          <span className="fw-medium text-dark">{project.deadline}</span>
        </div>

        <div className="d-flex justify-content-between text-secondary">
          <span className="d-flex align-items-center gap-1">
            <UserCheck size={15} className="text-info" /> Freelancer:
          </span>
          <span className="fw-medium text-dark">
            {project.freelancer ? project.freelancer.username : <span className="text-muted fst-italic">Unassigned</span>}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <Link
          to={`/projects/${project.id}`}
          className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-1 fw-semibold text-primary"
          style={{ fontSize: '0.85rem', padding: '0.45rem' }}
        >
          View Details <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};
