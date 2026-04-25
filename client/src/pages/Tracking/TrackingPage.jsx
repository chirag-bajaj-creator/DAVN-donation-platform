import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import trackingService from '../../services/trackingService';

function formatLabel(value) {
  return value ? String(value).replace(/_/g, ' ') : 'Not available';
}

function getMapPoint(location, bounds) {
  if (!location || !bounds) return null;

  const lngSpan = bounds.maxLng - bounds.minLng || 0.01;
  const latSpan = bounds.maxLat - bounds.minLat || 0.01;

  return {
    x: ((location.lng - bounds.minLng) / lngSpan) * 100,
    y: (1 - ((location.lat - bounds.minLat) / latSpan)) * 100
  };
}

function TrackingMap({ data }) {
  const caseLocation = data?.case?.location;
  const volunteerLocation = data?.tracking?.volunteerLocation;
  const hasBoth = Boolean(caseLocation && volunteerLocation);

  console.info('[Track Aid] Rendering tracking map', {
    caseId: data?.case?._id,
    needyType: data?.case?.needyType,
    status: data?.tracking?.status,
    hasCaseLocation: Boolean(caseLocation),
    caseLocation,
    hasVolunteerLocation: Boolean(volunteerLocation),
    volunteerLocation,
    distanceKm: data?.tracking?.distanceKm,
    lastLocationAt: data?.tracking?.lastLocationAt
  });

  const bounds = hasBoth ? {
    minLat: Math.min(caseLocation.lat, volunteerLocation.lat) - 0.01,
    maxLat: Math.max(caseLocation.lat, volunteerLocation.lat) + 0.01,
    minLng: Math.min(caseLocation.lng, volunteerLocation.lng) - 0.01,
    maxLng: Math.max(caseLocation.lng, volunteerLocation.lng) + 0.01,
  } : null;
  const casePoint = getMapPoint(caseLocation, bounds) || { x: 76, y: 28 };
  const volunteerPoint = getMapPoint(volunteerLocation, bounds) || { x: 18, y: 68 };
  const volunteerStyle = { left: `${volunteerPoint.x}%`, top: `${volunteerPoint.y}%` };
  const caseStyle = { left: `${casePoint.x}%`, top: `${casePoint.y}%` };

  return (
    <div className="tracking-map" aria-label="Live route map">
      <div className="tracking-map-grid" />
      {hasBoth && (
        <svg className="tracking-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line
            x1={volunteerPoint.x}
            y1={volunteerPoint.y}
            x2={casePoint.x}
            y2={casePoint.y}
            className="tracking-route-svg-line"
          />
        </svg>
      )}
      <div className="tracking-pin tracking-pin-volunteer" style={volunteerStyle}>
        <span>V</span>
        <strong>Volunteer</strong>
      </div>
      <div className="tracking-pin tracking-pin-case" style={caseStyle}>
        <span>N</span>
        <strong>Need location</strong>
      </div>
      <div className="tracking-map-footer">
        <span>{hasBoth ? `${data.tracking.distanceKm} km away` : 'Waiting for volunteer GPS'}</span>
        {caseLocation && (
          <a
            href={`https://www.openstreetmap.org/?mlat=${caseLocation.lat}&mlon=${caseLocation.lng}#map=15/${caseLocation.lat}/${caseLocation.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Open map
          </a>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const { needyType, caseId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [liveState, setLiveState] = useState('connecting');
  const hasTrackingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadInitialTracking = async () => {
      try {
        setLoading(true);
        console.info('[Track Aid] Tracking page mounted', { needyType, caseId });
        const data = await trackingService.getCaseTracking(needyType, caseId);
        if (!isMounted) return;
        hasTrackingRef.current = true;
        setTracking(data);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        console.error('[Track Aid] Failed to load route details', {
          needyType,
          caseId,
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setError(err.response?.data?.error || 'Unable to load tracking details');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialTracking();

    const stream = trackingService.openTrackingStream(needyType, caseId, {
      onUpdate: (data) => {
        if (!isMounted) return;
        console.info('[Track Aid] Applying live tracking update to page', {
          needyType,
          caseId,
          status: data?.tracking?.status,
          hasVolunteerLocation: Boolean(data?.tracking?.volunteerLocation),
          lastLocationAt: data?.tracking?.lastLocationAt
        });
        hasTrackingRef.current = true;
        setTracking(data);
        setError('');
        setLoading(false);
        setLiveState('live');
      },
      onError: () => {
        if (!isMounted) return;
        console.warn('[Track Aid] Live tracking stream not ready', {
          needyType,
          caseId,
          hasInitialTracking: hasTrackingRef.current
        });
        setLiveState('reconnecting');
        if (!hasTrackingRef.current) {
          setError('Live tracking is connecting. Current route data will appear when available.');
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      stream.close();
    };
  }, [caseId, needyType]);

  const statusText = useMemo(() => formatLabel(tracking?.tracking?.status), [tracking]);

  return (
    <MainLayout>
      <div className="client-responsive-shell tracking-shell">
        <section className="client-panel client-shell-section">
          <span className="client-kicker">Live aid route</span>
          <h1 className="client-page-title">Volunteer Tracking</h1>
          <p className="client-page-copy">
            Track the assigned volunteer while the case is active. The marker updates as soon as location is shared.
          </p>
          <div className={`tracking-live-pill is-${liveState}`}>
            {liveState === 'live' ? 'Live connection active' : 'Connecting live map'}
          </div>
        </section>

        {loading && (
          <section className="client-panel client-shell-section">
            <p className="client-page-copy">Loading tracking details...</p>
          </section>
        )}

        {error && (
          <section className="client-panel client-shell-section">
            <p className="client-form-error">{error}</p>
            <Link to="/tracking" className="client-button mt-4">Back to tracking list</Link>
          </section>
        )}

        {!loading && !error && tracking && (
          <>
            <section className="client-panel client-shell-section tracking-status-grid">
              <div className="tracking-status-card">
                <span>Status</span>
                <strong>{statusText}</strong>
              </div>
              <div className="tracking-status-card">
                <span>Distance</span>
                <strong>{tracking.tracking.distanceKm !== null ? `${tracking.tracking.distanceKm} km` : 'Waiting'}</strong>
              </div>
              <div className="tracking-status-card">
                <span>ETA</span>
                <strong>{tracking.tracking.estimatedMinutes ? `${tracking.tracking.estimatedMinutes} min` : 'Pending GPS'}</strong>
              </div>
              <div className="tracking-status-card">
                <span>Last update</span>
                <strong>{tracking.tracking.lastLocationAt ? new Date(tracking.tracking.lastLocationAt).toLocaleTimeString() : 'No update yet'}</strong>
              </div>
            </section>

            <section className="client-panel client-shell-section">
              <TrackingMap data={tracking} />
            </section>

            <section className="client-panel client-shell-section tracking-detail-grid">
              <div>
                <span className="client-kicker">Case</span>
                <h2>{tracking.case.name}</h2>
                <p>{formatLabel(tracking.case.type_of_need)} - {formatLabel(tracking.case.urgency)}</p>
                <p>{tracking.case.addressText}</p>
              </div>
              <div>
                <span className="client-kicker">Volunteer</span>
                <h2>{tracking.volunteer?.name || 'Not assigned yet'}</h2>
                <p>{tracking.volunteer?.phone || 'Phone not available'}</p>
                <p>{tracking.tracking.status === 'completed' ? 'Tracking is complete.' : 'Live map updates automatically.'}</p>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}
