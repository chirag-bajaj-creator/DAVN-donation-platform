import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import volunteerService from '../services/volunteerService';

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
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await volunteerService.getAssignedCases();
        // Mock stats calculation - adjust based on actual API response
        setStats({
          assignedCases: response.data?.data?.length || 0,
          completedCases: 0,
          pendingReports: 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Don't toast error on first load, just use defaults
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4 animate-spin">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Content wrapped in Layout which provides Navbar + Footer */}
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0284c7 0%, #0ea5e9 50%, #a855f7 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Stats Grid */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>Welcome back, {user?.name || 'Volunteer'}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '48px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3), rgba(14, 165, 233, 0.3))', borderRadius: '20px', backdropFilter: 'blur(8px)', border: '2px solid rgba(2, 132, 199, 0.4)', flexShrink: 0 }}>
              <svg style={{ width: '60px', height: '60px', color: '#0284c7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Assigned Cases</p>
              <p style={{ fontSize: '80px', fontWeight: '900', background: 'linear-gradient(to right, #0284c7, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '12px 0 0 0', lineHeight: '1' }}>{stats.assignedCases}</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3))', borderRadius: '20px', backdropFilter: 'blur(8px)', border: '2px solid rgba(34, 197, 94, 0.4)', flexShrink: 0 }}>
              <svg style={{ width: '60px', height: '60px', color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Completed Cases</p>
              <p style={{ fontSize: '80px', fontWeight: '900', background: 'linear-gradient(to right, #22c55e, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '12px 0 0 0', lineHeight: '1' }}>{stats.completedCases}</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.3), rgba(234, 88, 12, 0.3))', borderRadius: '20px', backdropFilter: 'blur(8px)', border: '2px solid rgba(217, 119, 6, 0.4)', flexShrink: 0 }}>
              <svg style={{ width: '60px', height: '60px', color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Pending Reports</p>
              <p style={{ fontSize: '80px', fontWeight: '900', background: 'linear-gradient(to right, #d97706, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '12px 0 0 0', lineHeight: '1' }}>{stats.pendingReports}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <Link
              to="/my-tasks"
              style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #0284c7, #a855f7) 1', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.3s', textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(2, 132, 199, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <p style={{ margin: 0, marginBottom: '8px', fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>My Tasks</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>View assigned cases</p>
            </Link>

            <Link
              to="/submit-report"
              style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #a855f7, #ec4899) 1', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.3s', textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(168, 85, 247, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <p style={{ margin: 0, marginBottom: '8px', fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Submit Report</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Verify completed work</p>
            </Link>

            <Link
              to="/login"
              onClick={handleLogout}
              style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #ec4899, #0ea5e9) 1', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.3s', textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(236, 72, 153, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <p style={{ margin: 0, marginBottom: '8px', fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #ec4899 0%, #0ea5e9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Logout</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Exit volunteer app</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Volunteer Network</h2>
          <p className="text-gray-600">
            You're all set! Browse the quick actions above to get started. Check your assigned tasks, submit verification reports, or manage your profile.
          </p>
        </div>
        </div>
      </div>
      </Layout>
    );
  }

