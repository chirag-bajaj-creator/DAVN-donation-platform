import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../styles/adminLayout.css';

export default function AdminLayout({ children }) {
  console.log('🏗️ AdminLayout RENDERING');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  console.log('📍 AdminLayout - user:', user);
  console.log('📍 AdminLayout - logout function exists:', !!logout);
  console.log('📍 AdminLayout - children:', children);

  const menuItems = [
    { label: 'Dashboard', path: '/panel' },
    { label: 'Donations', path: '/panel/donations' },
    { label: 'Volunteers', path: '/panel/volunteers' },
    { label: 'Needy Verification', path: '/panel/needy' },
    { label: 'Users', path: '/panel/users' }
  ];

  const handleLogout = () => {
    console.log('🚪 LOGOUT BUTTON CLICKED');
    console.log('logout function:', logout);
    try {
      logout();
      console.log('✅ Logged out successfully');
      navigate('/');
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

    return (
      <div className="admin-layout">
      <div style={{ position: 'fixed', top: '10px', left: '10px', padding: '15px', backgroundColor: '#00ff00', color: '#000', zIndex: 9999, fontWeight: 'bold', fontSize: '16px', borderRadius: '4px' }}>
        ✅ AdminLayout VISIBLE!
      </div>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Hravinder</h2>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ backgroundColor: '#f5f5f5' }}>
        <header className="admin-header" style={{ backgroundColor: '#fff', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ color: '#0284c7', margin: 0 }}>🏠 Admin Panel</h1>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '16px'
              }}
            >
              🚪 LOGOUT
            </button>
          </div>
        </header>

        <div className="content" style={{ padding: '30px', minHeight: '100vh' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
