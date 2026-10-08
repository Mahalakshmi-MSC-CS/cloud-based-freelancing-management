import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isClient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom border-subtle sticky-top px-3 py-2">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center fw-bold fs-5 text-decoration-none">
          <span className="p-2 rounded-3 bg-primary text-white d-inline-flex me-2">
            <Layers size={20} />
          </span>
          <span className="brand-gradient">CloudFreelance</span>
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          {user ? (
            <>
              <div className="d-none d-md-flex flex-column text-end">
                <span className="fw-semibold text-dark" style={{ fontSize: '0.88rem' }}>
                  {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                </span>
                <span
                  className="badge rounded-pill align-self-end text-capitalize"
                  style={{
                    backgroundColor: isClient ? '#e0e7ff' : '#dcfce7',
                    color: isClient ? '#3730a3' : '#166534',
                    fontSize: '0.7rem',
                  }}
                >
                  {user.role}
                </span>
              </div>

              <Link
                to="/profile"
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
                title="Profile"
                style={{ width: '38px', height: '38px' }}
              >
                <UserIcon size={18} className="text-secondary" />
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-3 px-3 py-1"
                title="Log out"
              >
                <LogOut size={16} />
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-custom btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary-custom btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
