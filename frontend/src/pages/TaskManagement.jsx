import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { TaskModal } from '../components/TaskModal';
import { AlertBanner } from '../components/AlertBanner';
import { Search, Filter, PlusCircle, Edit, Trash2, CheckSquare } from 'lucide-react';

export const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [freelancers, setFreelancers] = useState([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { isClient, user } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (projectFilter) params.project = projectFilter;

      const [taskData, projectData, freelancerData] = await Promise.all([
        taskService.getTasks(params),
        projectService.getProjects(),
        authService.getFreelancers(),
      ]);

      setTasks(taskData);
      setProjects(projectData);
      setFreelancers(freelancerData);
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter, projectFilter]);

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
        setSuccess('Task updated successfully.');
      } else {
        await taskService.createTask(taskData);
        setSuccess('Task created successfully.');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError('Failed to save task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setSuccess('Task deleted successfully.');
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleQuickProgressUpdate = async (taskId, newProgress) => {
    try {
      const p = parseInt(newProgress, 10);
      const newStatus = p === 100 ? 'completed' : p > 0 ? 'in_progress' : 'todo';
      await taskService.updateProgress(taskId, {
        progress_percentage: p,
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task progress.');
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Task Management</h2>
          <p className="text-muted small mb-0">Organize, filter, and track granular project deliverables</p>
        </div>
        {projects.length > 0 && (
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary-custom d-inline-flex align-items-center gap-2 align-self-start align-self-md-auto"
          >
            <PlusCircle size={18} />
            <span>Create Task</span>
          </button>
        )}
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-8">
            <div className="row g-2">
              <div className="col-sm-4">
                <select
                  className="form-select form-select-sm"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-4">
                <select
                  className="form-select form-select-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="col-sm-4">
                <select
                  className="form-select form-select-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card border-0 shadow-card bg-white rounded-3 p-4">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CheckSquare size={48} className="mx-auto mb-2 text-secondary opacity-50" />
            <h5 className="fw-bold">No Tasks Found</h5>
            <p className="small mb-0">No tasks match your current criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th>Task Title</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th style={{ minWidth: '160px' }}>Progress</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <span className="fw-semibold text-dark">{task.title}</span>
                      {task.description && (
                        <small className="d-block text-muted text-truncate" style={{ maxWidth: '240px' }}>
                          {task.description}
                        </small>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {task.project_title}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {task.assigned_to_username || <span className="fst-italic">Unassigned</span>}
                      </small>
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
                          step="5"
                          value={task.progress_percentage}
                          onChange={(e) => handleQuickProgressUpdate(task.id, e.target.value)}
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
                            setIsModalOpen(true);
                          }}
                          className="btn btn-sm btn-light border p-1"
                          title="Edit Task"
                        >
                          <Edit size={14} className="text-primary" />
                        </button>
                        {isClient && (
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
        projectId={editingTask?.project || projects[0]?.id}
        freelancers={freelancers}
        isEdit={!!editingTask}
      />
    </div>
  );
};
