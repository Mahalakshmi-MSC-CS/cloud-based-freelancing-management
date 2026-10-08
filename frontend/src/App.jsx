import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ClientDashboard } from './pages/ClientDashboard';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { ProjectList } from './pages/ProjectList';
import { ProjectDetails } from './pages/ProjectDetails';
import { CreateProject } from './pages/CreateProject';
import { EditProject } from './pages/EditProject';
import { TaskManagement } from './pages/TaskManagement';
import { Profile } from './pages/Profile';

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'client') {
    return <Navigate to="/client-dashboard" replace />;
  }
  return <Navigate to="/freelancer-dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Client-Only Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/projects/:id/edit" element={<EditProject />} />
          </Route>

          {/* Freelancer-Only Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
            <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
