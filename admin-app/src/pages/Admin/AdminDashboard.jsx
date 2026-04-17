import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { adminService, getAdminSocket } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import Loading from '../../components/Common/Loading';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();

    const socket = getAdminSocket();

    if (socket) {
      const handleRealtimeRefresh = () => {
        fetchStats();
      };

      socket.on('admin:assignment-created', handleRealtimeRefresh);
      socket.on('admin:case-updated', handleRealtimeRefresh);
      socket.on('admin:report-submitted', handleRealtimeRefresh);
      socket.on('admin:volunteer-updated', handleRealtimeRefresh);

      return () => {
        socket.off('admin:assignment-created', handleRealtimeRefresh);
        socket.off('admin:case-updated', handleRealtimeRefresh);
        socket.off('admin:report-submitted', handleRealtimeRefresh);
        socket.off('admin:volunteer-updated', handleRealtimeRefresh);
      };
    }
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📊 Fetching admin stats...');
      const res = await adminService.getStats();
      console.log('✅ Stats fetched:', res);
      setStats(res.data || res);
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Set default stats to show something
      setStats({
        totalUsers: 0,
        totalDonations: 0,
        volunteers: { total: 0, pending: 0, active: 0 },
        pendingVerification: 0,
        donations: { stats: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('🔍 AdminDashboard render - loading:', loading, 'stats:', stats);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>✅ Admin Dashboard Loaded</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🚪 Logout
          </button>
        </div>
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <br />
            <small>Backend may not be running. Showing placeholder data.</small>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Donations</div>
            <div className="stat-value">{stats?.totalDonations || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Volunteers</div>
            <div className="stat-value">{stats?.volunteers?.total || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Volunteers</div>
            <div className="stat-value">{stats?.volunteers?.pending || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Needy</div>
            <div className="stat-value">{stats?.pendingVerification || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Volunteers</div>
            <div className="stat-value">{stats?.volunteers?.active || 0}</div>
          </div>
        </div>

        {stats?.donations?.stats && stats.donations.stats.length > 0 && (
          <div className="donations-breakdown">
            <h2>Donations by Status</h2>
            <div className="breakdown-grid">
              {stats.donations.stats.map((stat, i) => (
                <div key={i} className="breakdown-item">
                  <span>{stat._id || 'Unknown'}</span>
                  <span>{stat.count} donations</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
