import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import Loading from '../../components/Common/Loading';

const STATUS_OPTIONS = [
  { value: '', label: 'All operational statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'verified', label: 'Verified' },
  { value: 'in_delivery', label: 'In delivery' },
  { value: 'completed', label: 'Completed' }
];

const STATUS_LABELS = {
  submitted: 'Submitted',
  verified: 'Verified',
  in_delivery: 'In delivery',
  completed: 'Completed'
};

const TYPE_LABELS = {
  cash: 'Cash',
  food: 'Food',
  shelter: 'Shelter',
  medical: 'Medical',
  basic_needs: 'Basic needs',
  clothes: 'Clothes',
  emergency: 'Emergency relief',
  campaign: 'Campaign'
};

const formatValue = (value, fallback = 'Not provided') => {
  if (Array.isArray(value)) return value.length ? value.join(', ') : fallback;
  if (typeof value === 'boolean') return value ? 'Required' : 'Not required';
  if (value === 0) return '0';
  return value || fallback;
};

const getDetail = (donation, keys, fallback) => {
  const details = donation.details || {};
  const source = { ...details, ...donation };
  const key = keys.find(k => source[k] !== undefined && source[k] !== null && source[k] !== '');
  return key ? source[key] : fallback;
};

const getOperationalDetails = (donation) => {
  const items = getDetail(donation, ['items', 'itemList', 'donatedItems']);
  const servings = getDetail(donation, ['servings', 'quantity', 'mealCount']);
  const pickupStart = getDetail(donation, ['pickupWindowStart']);
  const pickupEnd = getDetail(donation, ['pickupWindowEnd']);
  const pickupWindow = pickupStart || pickupEnd
    ? [pickupStart ? formatDate(pickupStart) : null, pickupEnd ? formatDate(pickupEnd) : null].filter(Boolean).join(' - ')
    : getDetail(donation, ['pickupWindow', 'pickup_window', 'preferredPickupWindow', 'pickupTime']);

  return {
    source: getDetail(donation, ['foodSource', 'source', 'donationSource', 'origin'], donation.donor_id?.name),
    pickupWindow,
    city: getDetail(donation, ['city', 'pickupCity', 'locationCity', 'emergencyLocation', 'address']),
    servingsItems: servings || items,
    campaign: getDetail(donation, ['campaignTitle', 'campaign', 'campaignName', 'campaign_id']),
    proofRequirement: getDetail(donation, ['proofType', 'proofRequired', 'proof_requirement', 'requiresProof', 'doctorPermission', 'consentToVerify'])
  };
};

const formatDate = (date) => {
  if (!date) return 'Date not available';
  return new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const OpsIcon = ({ children }) => (
  <span className="donation-ops-icon" aria-hidden="true">{children}</span>
);

export default function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetchDonations();

    async function fetchDonations() {
      try {
        setLoading(true);
        setError('');
        const res = await adminService.getDonations(50, skip, status || null);
        if (isMounted) {
          setDonations(res.data?.donations || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setDonations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, [status, skip]);

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div className="page-title-copy">
            <span className="page-eyebrow">Aid operations</span>
            <h1>Donation Triage</h1>
            <p className="page-description">
              Review submitted aid, verify operational details, and track delivery progress from intake to completion.
            </p>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}

        <div className="filters">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setSkip(0); }}
            className="filter-select"
            aria-label="Filter donations by operational status"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value || 'all'} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {donations.length > 0 ? (
          <div className="donation-triage-grid">
            {donations.map(donation => {
              const details = getOperationalDetails(donation);
              const typeLabel = TYPE_LABELS[donation.type] || donation.type || 'Aid';

              return (
                <article className="donation-triage-card" key={donation._id}>
                  <div className="donation-card-header">
                    <div>
                      <span className="donation-card-eyebrow">{typeLabel} donation</span>
                      <h2>{donation.donor_id?.name || 'Unknown donor'}</h2>
                      <p>{donation.donor_id?.email || donation.donor_id?.phone || 'No donor contact provided'}</p>
                    </div>
                    <span className={`badge badge-${donation.status}`}>
                      {STATUS_LABELS[donation.status] || donation.status || 'Unknown'}
                    </span>
                  </div>

                  <div className="donation-ops-grid">
                    <div className="donation-ops-item">
                      <OpsIcon>S</OpsIcon>
                      <span>Source</span>
                      <strong>{formatValue(details.source)}</strong>
                    </div>
                    <div className="donation-ops-item">
                      <OpsIcon>T</OpsIcon>
                      <span>Pickup window</span>
                      <strong>{formatValue(details.pickupWindow)}</strong>
                    </div>
                    <div className="donation-ops-item">
                      <OpsIcon>L</OpsIcon>
                      <span>City</span>
                      <strong>{formatValue(details.city)}</strong>
                    </div>
                    <div className="donation-ops-item">
                      <OpsIcon>I</OpsIcon>
                      <span>Servings / items</span>
                      <strong>{formatValue(details.servingsItems)}</strong>
                    </div>
                    <div className="donation-ops-item">
                      <OpsIcon>C</OpsIcon>
                      <span>Campaign</span>
                      <strong>{formatValue(details.campaign, 'General aid')}</strong>
                    </div>
                    <div className="donation-ops-item">
                      <OpsIcon>P</OpsIcon>
                      <span>Proof requirement</span>
                      <strong>{formatValue(details.proofRequirement)}</strong>
                    </div>
                  </div>

                  <div className="donation-card-footer">
                    <span><OpsIcon>V</OpsIcon> Submitted {formatDate(donation.createdAt)}</span>
                    <span><OpsIcon>D</OpsIcon> Amount/units: {formatValue(donation.amount)}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No donations found for this status.</div>
        )}
      </div>
    </AdminLayout>
  );
}
