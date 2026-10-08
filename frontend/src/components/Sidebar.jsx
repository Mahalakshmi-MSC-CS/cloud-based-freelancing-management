import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  PlusCircle,
  User,
} from 'lucide-react';

export const Sidebar = () => {
  const { isClient, user } = useAuth();

  const dashboardPath = isClient ? '/client-dashboard' : '/freelancer-dashboard';

  const navItems = [
    { to: dashboardPath, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    ...(isClient
      ? [{ to: '/projects/new', label: 'Create Project', icon: PlusCircle }]
      : []),
    { to: '/tasks', label: 'Task Management', icon: CheckSquare },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside
      className="bg-white border-end border-subtle d-flex flex-column p-3"
      style={{ minWidth: '240px', maxWidth: '240px' }}
    >
      <div className="mb-3 px-2">
        <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
          Navigation
        </small>
      </div>

      <nav className="nav nav-pills flex-column gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover-bg-light'
                }`
              }
            >
              <Icon size={18} />
              <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto pt-3 border-top border-subtle">
          <div className="p-2 bg-light rounded-3">
            <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Workspace Mode</small>
            <span className="fw-semibold text-dark text-capitalize" style={{ fontSize: '0.82rem' }}>
              {user.role} Workspace
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
