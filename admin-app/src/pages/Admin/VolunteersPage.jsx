import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import Loading from '../../components/Common/Loading';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchVolunteers();
  }, [tab]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getVolunteers(1, 50, tab);
      setVolunteers(res.data.volunteers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveVolunteer(id);
      setVolunteers(volunteers.filter(v => v._id !== id));
      alert('Volunteer approved successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectVolunteer(id, reason);
      setVolunteers(volunteers.filter(v => v._id !== id));
      setRejectModal(null);
      setReason('');
      alert('Volunteer rejected');
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
            <span className="page-eyebrow">Volunteer operations</span>
            <h1>Volunteer Management</h1>
            <p className="page-description">
              Approve new volunteers, monitor active status, and review rejected submissions.
            </p>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}

        <div className="tabs">
          <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
            Pending
          </button>
          <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
            Active
          </button>
          <button className={`tab ${tab === 'approved' ? 'active' : ''}`} onClick={() => setTab('approved')}>
            Approved
          </button>
          <button className={`tab ${tab === 'rejected' ? 'active' : ''}`} onClick={() => setTab('rejected')}>
            Rejected
          </button>
        </div>

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Status</th>
                {tab === 'pending' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {volunteers.length > 0 ? volunteers.map(v => (
                <tr key={v._id}>
                  <td>{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.phone}</td>
                  <td>{v.specialization || 'N/A'}</td>
                  <td><span className={`badge badge-${v.status}`}>{v.status}</span></td>
                  {tab === 'pending' && (
                    <td>
                      <button className="btn-small btn-approve" onClick={() => handleApprove(v._id)}>Approve</button>
                      <button className="btn-small btn-reject" onClick={() => setRejectModal(v._id)}>Reject</button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan="6">No volunteers found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {rejectModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Reject Volunteer</h2>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection reason"
                rows="4"
              />
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => handleReject(rejectModal)}>Reject</button>
                <button className="btn-secondary" onClick={() => setRejectModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
