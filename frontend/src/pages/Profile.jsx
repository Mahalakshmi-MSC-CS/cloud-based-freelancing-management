import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { AlertBanner } from '../components/AlertBanner';
import { User, Mail, Phone, Building, Code, Save } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser, isClient } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    skills: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        company_name: user.company_name || '',
        skills: user.skills || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updated = await authService.updateProfile(formData);
      updateUser(updated);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ maxWidth: '800px' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">User Profile</h2>
        <p className="text-muted small mb-0">Manage your account information and contact details</p>
      </div>

      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      <div className="card border-0 shadow-card bg-white rounded-4 p-4 p-md-5 mb-4">
        {/* Profile Header Summary */}
        <div className="d-flex align-items-center gap-3 pb-4 mb-4 border-bottom border-subtle">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3"
            style={{ width: '64px', height: '64px' }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="fw-bold mb-1">{user?.username}</h4>
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted d-flex align-items-center gap-1">
                <Mail size={14} /> {user?.email}
              </span>
              <span
                className="badge rounded-pill text-capitalize"
                style={{
                  backgroundColor: isClient ? '#e0e7ff' : '#dcfce7',
                  color: isClient ? '#3730a3' : '#166534',
                  fontSize: '0.72rem',
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">First Name</label>
              <input
                type="text"
                name="first_name"
                className="form-control"
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
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <Phone size={16} />
                </span>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {isClient ? (
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Company Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <Building size={16} />
                  </span>
                  <input
                    type="text"
                    name="company_name"
                    className="form-control"
                    placeholder="Acme Inc."
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Skills & Expertise</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <Code size={16} />
                  </span>
                  <input
                    type="text"
                    name="skills"
                    className="form-control"
                    placeholder="Python, React, AWS, Docker"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Professional Bio</label>
            <textarea
              name="bio"
              className="form-control"
              rows="3"
              placeholder="Tell us about yourself and your background..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-end pt-3 border-top border-subtle">
            <button
              type="submit"
              className="btn btn-primary-custom d-flex align-items-center gap-2 px-4"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
