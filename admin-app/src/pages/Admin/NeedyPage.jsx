import { useState, useEffect } from 'react';
import { adminService, getAdminSocket } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import Loading from '../../components/Common/Loading';

export default function NeedyPage() {
  const [needy, setNeedy] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');

  useEffect(() => {
    fetchData();

    const socket = getAdminSocket();

    if (socket) {
      const handleRealtimeRefresh = () => {
        fetchData();
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const needyRes = await adminService.getPendingNeedy(1, 50);
      const volRes = await adminService.getVolunteers(1, 100);
      const reportsRes = await adminService.getVerificationReports(20, 0);
      setNeedy(needyRes.data.needy);
      setVolunteers(volRes.data.volunteers);
      setReports(reportsRes.data.reports);
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

  const handleDownloadPdf = async (report) => {
    try {
      const blob = await adminService.downloadVerificationReportPdf(report._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `verification-report-${report._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
            <span className="page-eyebrow">Verification queue</span>
            <h1>Needy Verification</h1>
            <p className="page-description">
              Assign volunteers to pending cases and download submitted verification reports.
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
        </div>

        <div className="section-spacing">
          <h2 className="section-title">Volunteer Reports</h2>
          <div className="table-shell">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Needy Type</th>
                  <th>Status</th>
                  <th>Recommendation</th>
                  <th>Trust Score</th>
                  <th>Submitted</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? reports.map(report => (
                  <tr key={report._id}>
                    <td>{report.verified_by?.name || report.verified_by?.email || 'Unknown'}</td>
                    <td>{report.needy_type}</td>
                    <td>{report.status}</td>
                    <td>{report.recommendation}</td>
                    <td>{report.trustScore}</td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-small btn-assign" onClick={() => handleDownloadPdf(report)}>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7">No verification reports submitted yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
