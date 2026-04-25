import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import trackingService from '../../services/trackingService';

function formatLabel(value) {
  return value ? String(value).replace(/_/g, ' ') : 'Not available';
}

export default function TrackingListPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const trackingCases = await trackingService.getMyTrackingCases();
        console.info('[Track Aid] Rendering tracking list', {
          count: trackingCases.length,
          routeTargets: trackingCases.map(item => ({
            needyType: item.needyType,
            caseId: item._id,
            trackingStatus: item.trackingStatus,
            route: `/tracking/${item.needyType}/${item._id}`
          }))
        });
        setCases(trackingCases);
        setError('');
      } catch (err) {
        console.error('[Track Aid] Failed to load tracking list', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setError(err.response?.data?.error || 'Unable to load tracking cases');
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  return (
    <MainLayout>
      <div className="client-responsive-shell tracking-shell">
        <section className="client-panel client-shell-section">
          <span className="client-kicker">My requests</span>
          <h1 className="client-page-title">Track Aid</h1>
          <p className="client-page-copy">
            View assigned volunteer status and live route details for requests submitted from this account.
          </p>
        </section>

        {loading && <section className="client-panel client-shell-section">Loading tracking cases...</section>}
        {error && <section className="client-panel client-shell-section client-form-error">{error}</section>}

        {!loading && !error && (
          <section className="tracking-case-list">
            {cases.length === 0 ? (
              <div className="client-panel client-shell-section">
                <p className="client-page-copy">No tracked requests yet. Submit a needy registration with location enabled to start tracking.</p>
              </div>
            ) : (
              cases.map((item) => (
                <article key={`${item.needyType}-${item._id}`} className="client-panel client-shell-section tracking-case-card">
                  <div>
                    <span className="client-kicker">{formatLabel(item.type_of_need)}</span>
                    <h2>{item.name}</h2>
                    <p>{item.addressText}</p>
                  </div>
                  <div className="tracking-case-actions">
                    <span>{formatLabel(item.trackingStatus)}</span>
                    <Link
                      to={`/tracking/${item.needyType}/${item._id}`}
                      className="client-button"
                      onClick={() => console.info('[Track Aid] Track Route clicked', {
                        needyType: item.needyType,
                        caseId: item._id,
                        route: `/tracking/${item.needyType}/${item._id}`
                      })}
                    >
                      Track Route
                    </Link>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </MainLayout>
  );
}
