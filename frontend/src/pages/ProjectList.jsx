import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';
import { ProjectCard } from '../components/ProjectCard';
import { AlertBanner } from '../components/AlertBanner';
import { Search, PlusCircle, Filter, FolderKanban } from 'lucide-react';

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isClient } = useAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const data = await projectService.getProjects(params);
      setProjects(data);
    } catch (err) {
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Projects</h2>
          <p className="text-muted small mb-0">Browse, monitor, and filter project deliverables</p>
        </div>
        {isClient && (
          <Link
            to="/projects/new"
            className="btn btn-primary-custom d-inline-flex align-items-center gap-2 align-self-start align-self-md-auto"
          >
            <PlusCircle size={18} />
            <span>Create Project</span>
          </Link>
        )}
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Search projects by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-5">
            <div className="d-flex align-items-center gap-2">
              <Filter size={18} className="text-muted flex-shrink-0" />
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card border-0 shadow-card bg-white rounded-3 p-5 text-center">
          <FolderKanban size={48} className="mx-auto mb-3 text-secondary opacity-50" />
          <h5 className="fw-bold">No Projects Found</h5>
          <p className="text-muted small mb-3">
            {search || statusFilter
              ? 'No projects match your current filters. Try changing your search query.'
              : 'You have not created or been assigned any projects yet.'}
          </p>
          {isClient && (
            <div>
              <Link to="/projects/new" className="btn btn-primary-custom btn-sm">
                Create First Project
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div key={project.id} className="col-md-6 col-xl-4">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
