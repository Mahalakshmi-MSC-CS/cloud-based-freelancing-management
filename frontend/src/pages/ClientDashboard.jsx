import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { AlertBanner } from '../components/AlertBanner';
import {
  FolderKanban,
  PlayCircle,
  CheckCircle,
  Clock,
  CheckSquare,
  PlusCircle,
  ArrowRight,
  DollarSign,
} from 'lucide-react';

export const ClientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, projectsData] = await Promise.all([
          projectService.getStats(),
          projectService.getProjects(),
        ]);
        setStats(statsData);
        setRecentProjects(projectsData.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard metrics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Client Dashboard</h2>
          <p className="text-muted small mb-0">Overview of your freelance projects, tasks, and budgets</p>
        </div>
        <Link
          to="/projects/new"
          className="btn btn-primary-custom d-inline-flex align-items-center gap-2 align-self-start align-self-md-auto"
        >
          <PlusCircle size={18} />
          <span>Create New Project</span>
        </Link>
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      {/* Stats Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Total Projects"
            value={stats?.total_projects || 0}
            icon={FolderKanban}
            color="#4f46e5"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Active Projects"
            value={stats?.active_projects || 0}
            icon={PlayCircle}
            color="#2563eb"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Completed Projects"
            value={stats?.completed_projects || 0}
            icon={CheckCircle}
            color="#16a34a"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Pending Projects"
            value={stats?.pending_projects || 0}
            icon={Clock}
            color="#d97706"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Total Tasks"
            value={stats?.total_tasks || 0}
            icon={CheckSquare}
            color="#9333ea"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Completed Tasks"
            value={stats?.completed_tasks || 0}
            icon={CheckCircle}
            color="#059669"
            subtext={`Total Budget: $${(stats?.total_budget || 0).toLocaleString()}`}
          />
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="card border-0 shadow-card bg-white rounded-3 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Recent Projects</h5>
          <Link to="/projects" className="text-primary text-decoration-none small fw-semibold d-flex align-items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FolderKanban size={48} className="mb-2 text-secondary opacity-50" />
            <p className="mb-2">No projects found yet.</p>
            <Link to="/projects/new" className="btn btn-sm btn-primary-custom">
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light text-muted small">
                <tr>
                  <th>Project Name</th>
                  <th>Freelancer</th>
                  <th>Budget</th>
                  <th>Deadline</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-semibold">
                      <Link to={`/projects/${p.id}`} className="text-dark text-decoration-none">
                        {p.title}
                      </Link>
                    </td>
                    <td>
                      {p.freelancer ? (
                        <span className="badge bg-light text-dark border">
                          {p.freelancer.username}
                        </span>
                      ) : (
                        <span className="text-muted small fst-italic">Unassigned</span>
                      )}
                    </td>
                    <td className="fw-medium">${parseFloat(p.budget || 0).toLocaleString()}</td>
                    <td className="small text-muted">{p.deadline}</td>
                    <td style={{ minWidth: '140px' }}>
                      <ProgressBar progress={p.progress_percentage || 0} />
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="text-end">
                      <Link to={`/projects/${p.id}`} className="btn btn-sm btn-light border text-primary">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
