import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../styles/adminLayout.css';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/panel' },
    { label: 'Donations', path: '/panel/donations' },
    { label: 'Volunteers', path: '/panel/volunteers' },
    { label: 'Needy Verification', path: '/panel/needy' },
    { label: 'Users', path: '/panel/users' },
  ];

  const currentSection = menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      navigate('/');
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-orb admin-orb-one" />
      <div className="admin-orb admin-orb-two" />
      <div
        className={`admin-sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        role="presentation"
      />

      <aside id="admin-sidebar" className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-mark">A</span>
            <div>
              <h2>Admin Portal</h2>
              <p>Executive command center</p>
            </div>
          </div>
          <button type="button" className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            Menu
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
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
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-copy">
            <span className="admin-header-kicker">Internal operations</span>
            <h1>Admin panel</h1>
            <p>{currentSection} oversight for approvals, verification, and reporting.</p>
          </div>
          <div className="admin-header-actions">
            <div className="admin-user-chip">
              <span className="admin-user-label">Signed in</span>
              <strong>{user?.name || user?.email || 'Admin'}</strong>
            </div>
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-controls="admin-sidebar"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? 'Close menu' : 'Open menu'}
            </button>
            <button type="button" className="logout-btn-header" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}
