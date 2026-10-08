import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { AlertBanner } from '../components/AlertBanner';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    status: 'pending',
    freelancer_id: '',
  });

  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const data = await authService.getFreelancers();
        setFreelancers(data);
      } catch (err) {
        console.error('Could not load freelancers', err);
      }
    };
    loadFreelancers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget),
        freelancer_id: formData.freelancer_id ? parseInt(formData.freelancer_id, 10) : null,
      };
      const created = await projectService.createProject(payload);
      navigate(`/projects/${created.id}`);
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Failed to create project. Please verify inputs.';
      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        msg = `${firstKey}: ${data[firstKey]}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '800px' }}>
      <div className="mb-3">
        <Link to="/projects" className="text-secondary text-decoration-none small fw-semibold d-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>

      <div className="card border-0 shadow-card bg-white rounded-4 p-4 p-md-5">
        <div className="mb-4">
          <h3 className="fw-bold mb-1">Create New Project</h3>
          <p className="text-muted small mb-0">Define your project scope, budget, timeline, and assign a talent</p>
        </div>

        <AlertBanner type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Project Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Cloud-Native Microservices Migration"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Project Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              placeholder="Detailed description of objectives, deliverables, and expectations..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Budget (USD) *</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  name="budget"
                  className="form-control"
                  placeholder="5000"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Deadline *</label>
              <input
                type="date"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Initial Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Assign Freelancer (Optional)</label>
              <select
                name="freelancer_id"
                className="form-select"
                value={formData.freelancer_id}
                onChange={handleChange}
              >
                <option value="">Select Freelancer (Unassigned)</option>
                {freelancers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.username} {f.skills ? `(${f.skills})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top border-subtle">
            <Link to="/projects" className="btn btn-light border px-4">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary-custom d-flex align-items-center gap-2 px-4"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
