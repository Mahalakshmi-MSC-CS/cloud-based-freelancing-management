import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ProgressBar } from '../components/ProgressBar';
import { AlertBanner } from '../components/AlertBanner';
import {
  FolderKanban,
  PlayCircle,
  CheckCircle,
  Clock,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';

export const FreelancerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, projectsData, tasksData] = await Promise.all([
        projectService.getStats(),
        projectService.getProjects(),
        taskService.getTasks(),
      ]);
      setStats(statsData);
      setAssignedProjects(projectsData.slice(0, 5));
      setMyTasks(tasksData.slice(0, 6));
    } catch (err) {
      setError('Failed to load freelancer dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickStatusChange = async (taskId, newStatus, currentProgress) => {
    try {
      const progress = newStatus === 'completed' ? 100 : currentProgress;
      await taskService.updateProgress(taskId, {
        status: newStatus,
        progress_percentage: progress,
      });
      loadData();
    } catch (err) {
      alert('Could not update task status.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Freelancer Workspace</h2>
        <p className="text-muted small mb-0">Track your assigned projects, active tasks, and milestones</p>
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      {/* Stats Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Assigned Projects"
            value={stats?.total_projects || 0}
            icon={FolderKanban}
            color="#4f46e5"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="In Progress"
            value={stats?.active_projects || 0}
            icon={PlayCircle}
            color="#2563eb"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="Completed"
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
            title="Assigned Tasks"
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
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Assigned Projects */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-card bg-white rounded-3 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Assigned Projects</h5>
              <Link to="/projects" className="text-primary text-decoration-none small fw-semibold d-flex align-items-center gap-1">
                All Projects <ArrowRight size={14} />
              </Link>
            </div>

            {assignedProjects.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p className="mb-0">No projects currently assigned to you.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {assignedProjects.map((p) => (
                  <div key={p.id} className="p-3 border rounded-3 bg-light d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <Link to={`/projects/${p.id}`} className="fw-bold text-dark text-decoration-none">
                        {p.title}
                      </Link>
                      <StatusBadge status={p.status} />
                    </div>
                    <ProgressBar progress={p.progress_percentage || 0} height={6} />
                    <div className="d-flex justify-content-between text-muted small mt-1">
                      <span>Client: <strong>{p.client?.company_name || p.client?.username}</strong></span>
                      <span>Due: {p.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actionable Tasks */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-card bg-white rounded-3 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">My Urgent & Active Tasks</h5>
              <Link to="/tasks" className="text-primary text-decoration-none small fw-semibold d-flex align-items-center gap-1">
                Task Board <ArrowRight size={14} />
              </Link>
            </div>

            {myTasks.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p className="mb-0">No active tasks assigned.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {myTasks.map((t) => (
                  <div key={t.id} className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-white">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-semibold text-dark small">{t.title}</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                      <small className="text-muted d-block">
                        Project: {t.project_title} | Progress: {t.progress_percentage}%
                      </small>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select form-select-sm"
                        style={{ width: '120px', fontSize: '0.8rem' }}
                        value={t.status}
                        onChange={(e) => handleQuickStatusChange(t.id, e.target.value, t.progress_percentage)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
