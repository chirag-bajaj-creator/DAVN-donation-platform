import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import volunteerService, { getVolunteerSocket } from '../services/volunteerService';

function normalizeTaskStatus(task) {
  const rawStatus = task.uiStatus || task.status || 'pending';
  return rawStatus === 'verified' ? 'completed' : rawStatus;
}

function buildStats(cases) {
  const normalizedCases = Array.isArray(cases) ? cases : [];
  const statuses = normalizedCases.map(normalizeTaskStatus);

  return {
    assignedCases: normalizedCases.length,
    completedCases: statuses.filter((status) => status === 'completed').length,
    pendingReports: statuses.filter((status) => status === 'accepted').length,
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [stats, setStats] = useState({
    assignedCases: 0,
    completedCases: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await volunteerService.getAssignedCases();
        setStats(buildStats(response.data?.data));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const socket = getVolunteerSocket();

    if (socket) {
      const handleRealtimeRefresh = () => {
        fetchDashboardData();
      };

      socket.on('volunteer:assignment-created', handleRealtimeRefresh);
      socket.on('volunteer:case-updated', handleRealtimeRefresh);
      socket.on('volunteer:report-submitted', handleRealtimeRefresh);

      return () => {
        socket.off('volunteer:assignment-created', handleRealtimeRefresh);
        socket.off('volunteer:case-updated', handleRealtimeRefresh);
        socket.off('volunteer:report-submitted', handleRealtimeRefresh);
      };
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="volunteer-app-shell volunteer-loading-shell">
        <div className="volunteer-loading-card">
          <div className="volunteer-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="volunteer-page-shell">
        <section className="volunteer-page-hero">
          <span className="volunteer-page-kicker">Volunteer dashboard</span>
          <h1 className="volunteer-page-title">Welcome back, {user?.name || 'Volunteer'}</h1>
          <p className="volunteer-page-copy">
            Track assigned cases, pending reports, and completed verification work from one field-ready workspace.
          </p>

          <div className="volunteer-stats-grid">
            <div className="volunteer-stat-card">
              <span>Assigned Cases</span>
              <strong>{stats.assignedCases}</strong>
            </div>
            <div className="volunteer-stat-card">
              <span>Completed Cases</span>
              <strong>{stats.completedCases}</strong>
            </div>
            <div className="volunteer-stat-card">
              <span>Pending Reports</span>
              <strong>{stats.pendingReports}</strong>
            </div>
          </div>
        </section>

        <section className="volunteer-section">
          <div>
            <h2 className="volunteer-section-title">Quick actions</h2>
            <p className="volunteer-section-copy">Move directly into the field workflows that need attention.</p>
          </div>

          <div className="volunteer-action-grid">
            <Link to="/my-tasks" className="volunteer-action-card volunteer-action-card-primary">
              <h3>My Tasks</h3>
              <p>Review assigned cases, accept new work, and continue verification tasks.</p>
            </Link>

            <Link to="/submit-report" className="volunteer-action-card volunteer-action-card-secondary">
              <h3>Submit Report</h3>
              <p>Record findings and recommendations after completing a verification visit.</p>
            </Link>

            <button type="button" onClick={handleLogout} className="volunteer-action-card volunteer-action-card-danger">
              <h3>Logout</h3>
              <p>End this volunteer portal session and return to the public page.</p>
            </button>
          </div>
        </section>

        <section className="volunteer-panel volunteer-form-card">
          <h2 className="volunteer-form-heading">Volunteer Network</h2>
          <p className="volunteer-form-copy">
            You are ready to verify assigned cases, submit field reports, and keep admin teams updated with current status.
          </p>
        </section>
      </div>
    </Layout>
  );
}
