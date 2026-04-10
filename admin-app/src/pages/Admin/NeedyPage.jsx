import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import Loading from '../../components/Common/Loading';

export default function NeedyPage() {
  const [needy, setNeedy] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const needyRes = await adminService.getPendingNeedy(1, 50);
      const volRes = await adminService.getVolunteers(1, 100, 'approved');
      setNeedy(needyRes.data.needy);
      setVolunteers(volRes.data.volunteers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (needyId) => {
    if (!selectedVolunteer) {
      alert('Please select a volunteer');
      return;
    }
    try {
      await adminService.assignVolunteerToNeedy(needyId, selectedVolunteer);
      setNeedy(needy.filter(n => n._id !== needyId));
      setAssignModal(null);
      setSelectedVolunteer('');
      alert('Volunteer assigned successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Needy Verification</h1>
        {error && <div className="error-message">{error}</div>}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {needy.length > 0 ? needy.map(n => (
              <tr key={n._id}>
                <td>{n.name}</td>
                <td>{n.email}</td>
                <td>{n.phone}</td>
                <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-small btn-assign" onClick={() => setAssignModal(n._id)}>
                    Assign Volunteer
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5">No pending needy found</td></tr>
            )}
          </tbody>
        </table>

        {assignModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Assign Volunteer</h2>
              <select
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
                className="filter-select"
              >
                <option value="">Select a volunteer</option>
                {volunteers.map(v => (
                  <option key={v._id} value={v._id}>{v.name} ({v.specialization || 'General'})</option>
                ))}
              </select>
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => handleAssign(assignModal)}>Assign</button>
                <button className="btn-secondary" onClick={() => setAssignModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
