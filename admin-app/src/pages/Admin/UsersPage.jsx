import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import Loading from '../../components/Common/Loading';

export default function UsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers(50, 0);
      setUsers(res.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    if (userId === currentAdmin?.id) {
      alert('Cannot change your own role');
      return;
    }
    try {
      await adminService.updateUserRole(userId, role);
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
      setEditRole(null);
      setNewRole('');
      alert('Role updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div className="page-title-copy">
            <span className="page-eyebrow">Access control</span>
            <h1>User Management</h1>
            <p className="page-description">
              Review accounts, adjust roles, and keep the platform access matrix aligned.
            </p>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    {editRole === u._id ? (
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">Select Role</option>
                        <option value="user">User</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {editRole === u._id ? (
                      <>
                        <button className="btn-small btn-approve" onClick={() => handleRoleChange(u._id, newRole)}>
                          Save
                        </button>
                        <button className="btn-small btn-secondary" onClick={() => setEditRole(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn-small" onClick={() => {
                        setEditRole(u._id);
                        setNewRole(u.role);
                      }}>
                        Edit Role
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
