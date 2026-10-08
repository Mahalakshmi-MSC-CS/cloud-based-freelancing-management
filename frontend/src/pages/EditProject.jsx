import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { AlertBanner } from '../components/AlertBanner';
import { ArrowLeft, Save } from 'lucide-react';

export const EditProject = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [proj, freelancerList] = await Promise.all([
          projectService.getProject(id),
          authService.getFreelancers(),
        ]);
        setFormData({
          title: proj.title,
          description: proj.description,
          budget: proj.budget,
          deadline: proj.deadline,
          status: proj.status,
          freelancer_id: proj.freelancer ? proj.freelancer.id : '',
        });
        setFreelancers(freelancerList);
      } catch (err) {
        setError('Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget),
        freelancer_id: formData.freelancer_id ? parseInt(formData.freelancer_id, 10) : null,
      };
      await projectService.updateProject(id, payload);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError('Failed to update project. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '800px' }}>
      <div className="mb-3">
        <Link to={`/projects/${id}`} className="text-secondary text-decoration-none small fw-semibold d-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to Project Details
        </Link>
      </div>

      <div className="card border-0 shadow-card bg-white rounded-4 p-4 p-md-5">
        <div className="mb-4">
          <h3 className="fw-bold mb-1">Edit Project</h3>
          <p className="text-muted small mb-0">Update deliverables, adjust timeline, or reassign freelancer</p>
        </div>

        <AlertBanner type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Project Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
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
              <label className="form-label fw-semibold small">Status</label>
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
              <label className="form-label fw-semibold small">Assign Freelancer</label>
              <select
                name="freelancer_id"
                className="form-select"
                value={formData.freelancer_id}
                onChange={handleChange}
              >
                <option value="">Unassigned</option>
                {freelancers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.username} {f.skills ? `(${f.skills})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top border-subtle">
            <Link to={`/projects/${id}`} className="btn btn-light border px-4">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary-custom d-flex align-items-center gap-2 px-4"
              disabled={saving}
            >
              {saving ? (
                <div className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
