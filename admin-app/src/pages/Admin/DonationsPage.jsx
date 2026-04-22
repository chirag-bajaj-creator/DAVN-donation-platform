import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import Loading from '../../components/Common/Loading';

export default function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    fetchDonations();
  }, [status, skip]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDonations(50, skip, status || null);
      setDonations(res.data.donations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div className="page-title-copy">
            <span className="page-eyebrow">Financial flow</span>
            <h1>Donations Management</h1>
            <p className="page-description">
              Review donor submissions, filter approval states, and track incoming support.
            </p>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}

        <div className="filters">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setSkip(0); }} className="filter-select">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? donations.map(d => (
                <tr key={d._id}>
                  <td>{d.donor_id?.name || 'Unknown'}</td>
                  <td>{d.type}</td>
                  <td>{d.amount}</td>
                  <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="5">No donations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
