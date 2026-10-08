import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers, Briefcase, Code, ArrowRight } from 'lucide-react';
import { AlertBanner } from '../components/AlertBanner';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'client',
    first_name: '',
    last_name: '',
    company_name: '',
    skills: '',
    phone: '',
    bio: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/login', {
        state: { successMessage: 'Registration successful! You can now log in.' },
      });
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Registration failed. Please check the information provided.';
      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const val = data[firstKey];
        msg = `${firstKey}: ${Array.isArray(val) ? val.join(' ') : val}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: '580px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-4 bg-primary text-white mb-3 shadow-sm">
            <Layers size={32} />
          </div>
          <h3 className="fw-bold mb-1">Create an Account</h3>
          <p className="text-muted small">Choose your role and register to get started</p>
        </div>

        <AlertBanner type="danger" message={error} onClose={() => setError('')} />

        {/* Role Toggle */}
        <div className="d-flex gap-2 mb-4 p-1 bg-light rounded-3">
          <button
            type="button"
            className={`btn flex-fill d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold ${
              formData.role === 'client' ? 'btn-primary shadow-sm' : 'btn-light text-muted'
            }`}
            onClick={() => setFormData((p) => ({ ...p, role: 'client' }))}
          >
            <Briefcase size={18} />
            <span>I am a Client</span>
          </button>
          <button
            type="button"
            className={`btn flex-fill d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold ${
              formData.role === 'freelancer' ? 'btn-primary shadow-sm' : 'btn-light text-muted'
            }`}
            onClick={() => setFormData((p) => ({ ...p, role: 'freelancer' }))}
          >
            <Code size={18} />
            <span>I am a Freelancer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Username *</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">First Name</label>
              <input
                type="text"
                name="first_name"
                className="form-control"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="form-control"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.role === 'client' ? (
            <div className="mb-3">
              <label className="form-label fw-semibold small">Company Name</label>
              <input
                type="text"
                name="company_name"
                className="form-control"
                placeholder="Tech Innovations LLC"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label fw-semibold small">Skills & Expertise</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                placeholder="e.g. Python, Django, React, AWS, Docker"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Password *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Confirm Password *</label>
              <input
                type="password"
                name="password_confirm"
                className="form-control"
                placeholder="Repeat password"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-subtle">
          <p className="small text-muted mb-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-bold text-primary text-decoration-none">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
