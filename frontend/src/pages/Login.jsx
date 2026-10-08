import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers, Lock, User, ArrowRight } from 'lucide-react';
import { AlertBanner } from '../components/AlertBanner';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(username, password);
      const role = data.user?.role;
      if (role === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/freelancer-dashboard');
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Invalid username or password. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-4 bg-primary text-white mb-3 shadow-sm">
            <Layers size={32} />
          </div>
          <h3 className="fw-bold mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in to your Freelance Platform account</p>
        </div>

        <AlertBanner type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <User size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-subtle">
          <p className="small text-muted mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="fw-bold text-primary text-decoration-none">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
