import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  projectId = null,
  freelancers = [],
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    progress_percentage: 0,
    deadline: '',
    assigned_to_id: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'todo',
        progress_percentage: initialData.progress_percentage || 0,
        deadline: initialData.deadline || '',
        assigned_to_id: initialData.assigned_to ? initialData.assigned_to.id : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        progress_percentage: 0,
        deadline: '',
        assigned_to_id: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Sync progress when status is changed to completed
      if (name === 'status' && value === 'completed') {
        updated.progress_percentage = 100;
      } else if (name === 'progress_percentage' && parseInt(value, 10) === 100) {
        updated.status = 'completed';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        progress_percentage: parseInt(formData.progress_percentage, 10),
        assigned_to_id: formData.assigned_to_id ? parseInt(formData.assigned_to_id, 10) : null,
      };
      if (projectId && !isEdit) {
        payload.project_id = projectId;
      }
      await onSubmit(payload);
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.title?.[0] ||
        err.response?.data?.detail ||
        'Failed to save task. Please check the inputs.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header border-bottom border-subtle">
            <h5 className="modal-title fw-bold">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger p-2 small mb-3">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold small">Task Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Implement OAuth login"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Task details and acceptance criteria..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold small">Priority</label>
                  <select
                    name="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold small">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold small">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="form-control"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold small">Assign Freelancer</label>
                  <select
                    name="assigned_to_id"
                    className="form-select"
                    value={formData.assigned_to_id}
                    onChange={handleChange}
                  >
                    <option value="">Unassigned</option>
                    {freelancers.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.username} {f.first_name ? `(${f.first_name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <label className="form-label fw-semibold small">Progress</label>
                  <span className="small fw-bold text-primary">{formData.progress_percentage}%</span>
                </div>
                <input
                  type="range"
                  name="progress_percentage"
                  className="form-range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress_percentage}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer border-top border-subtle">
              <button
                type="button"
                className="btn btn-light border"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary-custom"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
