import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ProgressBar } from '../components/ProgressBar';
import { TaskModal } from '../components/TaskModal';
import { AlertBanner } from '../components/AlertBanner';
import {
  Calendar,
  DollarSign,
  UserCheck,
  Building,
  PlusCircle,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isClient } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projData, taskData, freelancerList] = await Promise.all([
        projectService.getProject(id),
        taskService.getTasks({ project: id }),
        authService.getFreelancers(),
      ]);
      setProject(projData);
      setTasks(taskData);
      setFreelancers(freelancerList);
    } catch (err) {
      setError('Could not load project details or you lack authorization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await projectService.updateProjectStatus(id, newStatus);
      setSuccess(`Project status updated to ${newStatus}.`);
      fetchProjectData();
    } catch (err) {
      setError('Failed to update project status.');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) {
      return;
    }
    try {
      await projectService.deleteProject(id);
      navigate('/projects');
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  const handleCreateOrUpdateTask = async (taskData) => {
    if (editingTask) {
      await taskService.updateTask(editingTask.id, taskData);
      setSuccess('Task updated successfully.');
    } else {
      await taskService.createTask(taskData);
      setSuccess('Task created successfully.');
    }
    setEditingTask(null);
    fetchProjectData();
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setSuccess('Task deleted successfully.');
      fetchProjectData();
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleTaskProgressChange = async (taskId, newProgress) => {
    try {
      const p = parseInt(newProgress, 10);
      const newStatus = p === 100 ? 'completed' : p > 0 ? 'in_progress' : 'todo';
      await taskService.updateProgress(taskId, {
        progress_percentage: p,
        status: newStatus,
      });
      fetchProjectData();
    } catch (err) {
      setError('Failed to update task progress.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-fluid p-0">
        <AlertBanner type="danger" message={error || 'Project not found.'} />
        <Link to="/projects" className="btn btn-outline-secondary">
          <ArrowLeft size={16} className="me-1" /> Back to Projects
        </Link>
      </div>
    );
  }

  const isOwner = project.client?.id === user?.id;

  return (
    <div className="container-fluid p-0">
      {/* Back button & top actions */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/projects" className="text-secondary text-decoration-none small fw-semibold d-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {isOwner && (
          <div className="d-flex gap-2">
            <Link to={`/projects/${project.id}/edit`} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <Edit size={15} /> Edit
            </Link>
            <button onClick={handleDeleteProject} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      {/* Project Header Card */}
      <div className="card border-0 shadow-card bg-white rounded-3 p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <h3 className="fw-bold mb-0 text-dark">{project.title}</h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted mb-0">{project.description}</p>
          </div>

          {/* Status Changer */}
          <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-3 border">
            <span className="small fw-semibold text-muted text-nowrap">Status:</span>
            <select
              className="form-select form-select-sm"
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="row g-3 pt-3 border-top border-subtle">
          <div className="col-sm-6 col-md-3">
            <small className="text-muted d-block">Budget</small>
            <span className="fw-bold fs-5 text-success d-flex align-items-center gap-1">
              <DollarSign size={18} />
              ${parseFloat(project.budget || 0).toLocaleString()}
            </span>
          </div>

          <div className="col-sm-6 col-md-3">
            <small className="text-muted d-block">Deadline</small>
            <span className="fw-semibold text-dark d-flex align-items-center gap-1 mt-1">
              <Calendar size={18} className="text-primary" />
              {project.deadline}
            </span>
          </div>

          <div className="col-sm-6 col-md-3">
            <small className="text-muted d-block">Client</small>
            <span className="fw-semibold text-dark d-flex align-items-center gap-1 mt-1">
              <Building size={18} className="text-secondary" />
              {project.client?.company_name || project.client?.username}
            </span>
          </div>

          <div className="col-sm-6 col-md-3">
            <small className="text-muted d-block">Assigned Freelancer</small>
            <span className="fw-semibold text-dark d-flex align-items-center gap-1 mt-1">
              <UserCheck size={18} className="text-info" />
              {project.freelancer ? project.freelancer.username : <span className="text-muted fst-italic">Unassigned</span>}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top border-subtle">
          <ProgressBar progress={project.progress_percentage || 0} height={10} />
          <div className="d-flex justify-content-between text-muted small mt-1">
            <span>Overall Progress</span>
            <span>{project.completed_tasks || 0} of {project.total_tasks || 0} Tasks Completed</span>
          </div>
        </div>
      </div>

      {/* Task Section */}
      <div className="card border-0 shadow-card bg-white rounded-3 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Project Tasks</h5>
            <p className="text-muted small mb-0">Manage tasks and track completion status</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1"
          >
            <PlusCircle size={16} /> Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-2">No tasks added to this project yet.</p>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="btn btn-sm btn-outline-custom"
            >
              Add first task
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th>Task Title</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th style={{ width: '180px' }}>Progress</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <span className="fw-semibold text-dark">{task.title}</span>
                      {task.description && (
                        <small className="d-block text-muted text-truncate" style={{ maxWidth: '280px' }}>
                          {task.description}
                        </small>
                      )}
                    </td>
                    <td>
                      <span className="small text-muted">
                        {task.assigned_to_username || <span className="fst-italic">None</span>}
                      </span>
                    </td>
                    <td>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="small text-muted">{task.deadline || '-'}</td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="100"
                          step="10"
                          value={task.progress_percentage}
                          onChange={(e) => handleTaskProgressChange(task.id, e.target.value)}
                        />
                        <span className="small fw-bold text-dark" style={{ minWidth: '35px' }}>
                          {task.progress_percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          className="btn btn-sm btn-light border p-1"
                          title="Edit Task"
                        >
                          <Edit size={14} className="text-primary" />
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="btn btn-sm btn-light border p-1"
                            title="Delete Task"
                          >
                            <Trash2 size={14} className="text-danger" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
        projectId={id}
        freelancers={freelancers}
        isEdit={!!editingTask}
      />
    </div>
  );
};
