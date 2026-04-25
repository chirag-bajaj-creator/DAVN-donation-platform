import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import volunteerService, { getVolunteerSocket } from '../services/volunteerService';

function formatLocation(address) {
  if (!address) return 'N/A';
  if (typeof address === 'string') return address;

  return [address.street, address.city, address.state, address.zipCode]
    .filter(Boolean)
    .join(', ') || 'N/A';
}

function normalizeTask(task) {
  const id = task._id || task.id;
  const rawStatus = task.uiStatus || task.status || 'pending';
  const needyType = task.needyType || task.type || 'individual';
  const documents = Array.isArray(task.documents) ? task.documents : [];

  return {
    id,
    key: id ? `${needyType}-${id}` : null,
    title: task.title || task.name || task.org_name || 'Untitled Case',
    description: task.description || 'No description available',
    status: rawStatus === 'verified' ? 'completed' : rawStatus,
    priority: task.priority || task.urgency || 'medium',
    needType: task.type_of_need || task.needType || task.category || 'field support',
    location: task.location || formatLocation(task.address),
    phone: task.phone || task.contactPhone || task.contactPerson?.phone || null,
    trustScore: task.trustScore ?? task.credibilityScore ?? null,
    proofCount: documents.length,
    contactName: task.contactPerson?.name || null,
    createdAt: task.createdAt || null,
    deadline: task.deadline || task.updatedAt || task.createdAt || null,
    needyType,
  };
}

function getStatusClass(status) {
  if (status === 'completed') return 'is-completed';
  if (status === 'accepted') return 'is-accepted';
  return 'is-pending';
}

function formatLabel(value) {
  if (!value) return 'Not specified';
  return String(value).replace(/_/g, ' ');
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : 'N/A';
}

const FieldIcon = ({ children }) => (
  <span className="volunteer-field-icon" aria-hidden="true">{children}</span>
);

export default function MyTasksPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingState, setTrackingState] = useState({
    enabled: false,
    message: 'Location sharing is off'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await volunteerService.getAssignedCases();
        const cases = Array.isArray(response.data?.data) ? response.data.data : [];
        setTasks(cases.map(normalizeTask).filter(task => task.id && task.key));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    const socket = getVolunteerSocket();

    if (socket) {
      const handleRealtimeRefresh = () => {
        fetchTasks();
      };

      socket.on('volunteer:assignment-created', handleRealtimeRefresh);
      socket.on('volunteer:case-updated', handleRealtimeRefresh);
      socket.on('volunteer:report-submitted', handleRealtimeRefresh);

      return () => {
        socket.off('volunteer:assignment-created', handleRealtimeRefresh);
        socket.off('volunteer:case-updated', handleRealtimeRefresh);
        socket.off('volunteer:report-submitted', handleRealtimeRefresh);
      };
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const hasAcceptedTask = tasks.some(task => task.status === 'accepted');

    if (!hasAcceptedTask || !navigator.geolocation) {
      return undefined;
    }

    const sendLocation = async (position) => {
      const payload = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'volunteer-browser',
        capturedAt: new Date(position.timestamp).toISOString()
      };

      try {
        await volunteerService.updateLocation(payload);
        setTrackingState({
          enabled: true,
          message: `Live location shared ${new Date().toLocaleTimeString()}`
        });
      } catch (error) {
        setTrackingState({
          enabled: false,
          message: 'Could not share live location'
        });
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      sendLocation,
      () => {
        setTrackingState({
          enabled: false,
          message: 'Allow location permission to enable live route tracking'
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 15000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [tasks]);

  const handleAccept = async (caseId) => {
    if (!caseId) {
      toast.error('Task id is missing');
      return;
    }

    try {
      await volunteerService.acceptCase(caseId);
      toast.success('Task accepted successfully');
      setTasks(currentTasks =>
        currentTasks.map(task => (task.id === caseId ? { ...task, status: 'accepted' } : task))
      );
    } catch (error) {
      toast.error('Failed to accept task');
    }
  };

  const handleReject = async (caseId) => {
    if (!caseId) {
      toast.error('Task id is missing');
      return;
    }

    try {
      await volunteerService.rejectCase(caseId);
      toast.success('Task rejected');
      setTasks(currentTasks => currentTasks.filter(task => task.id !== caseId));
    } catch (error) {
      toast.error('Failed to reject task');
    }
  };

  if (loading) {
    return (
      <div className="volunteer-app-shell volunteer-loading-shell">
        <div className="volunteer-loading-card">
          <div className="volunteer-spinner" />
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="volunteer-page-shell">
        <section className="volunteer-page-hero">
          <button type="button" className="volunteer-back-link" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </button>
          <span className="volunteer-page-kicker">Assigned cases</span>
          <h1 className="volunteer-page-title">My Tasks</h1>
          <p className="volunteer-page-copy">Cases assigned to you that need acceptance, verification, or report submission.</p>
          <div className={`volunteer-live-tracking ${trackingState.enabled ? 'is-on' : 'is-off'}`}>
            <span>{trackingState.enabled ? 'Live route active' : 'Route tracking'}</span>
            <strong>{trackingState.message}</strong>
          </div>
        </section>

        {tasks.length === 0 ? (
          <section className="volunteer-empty-card">
            <h2 className="volunteer-section-title">No tasks assigned yet</h2>
            <p className="volunteer-empty-copy">Check back later for new volunteer opportunities.</p>
            <button type="button" className="volunteer-task-action" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </button>
          </section>
        ) : (
          <section className="volunteer-task-list">
            {tasks.map((task) => (
              <article key={task.key} className="volunteer-task-card">
                <div className="volunteer-task-top">
                  <div>
                    <h3 className="volunteer-task-title">{task.title}</h3>
                    <p className="volunteer-task-description">{task.description}</p>
                  </div>
                  <span className={`volunteer-task-badge ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="volunteer-meta-grid">
                  <div className="volunteer-meta-item">
                    <span>Priority</span>
                    <strong>{formatLabel(task.priority)}</strong>
                  </div>
                  <div className="volunteer-meta-item">
                    <span>Location</span>
                    <strong>{task.location}</strong>
                  </div>
                  <div className="volunteer-meta-item">
                    <span>Assigned</span>
                    <strong>{formatDate(task.createdAt)}</strong>
                  </div>
                  <div className="volunteer-meta-item">
                    <span>Deadline</span>
                    <strong>{formatDate(task.deadline)}</strong>
                  </div>
                </div>

                <div className="volunteer-field-context">
                  <div className="volunteer-context-item">
                    <FieldIcon>N</FieldIcon>
                    <span>Need type</span>
                    <strong>{formatLabel(task.needType)}</strong>
                  </div>
                  <div className="volunteer-context-item">
                    <FieldIcon>C</FieldIcon>
                    <span>Contact</span>
                    <strong>{task.phone || 'Not shared'}</strong>
                  </div>
                  <div className="volunteer-context-item">
                    <FieldIcon>T</FieldIcon>
                    <span>Trust score</span>
                    <strong>{task.trustScore !== null ? `${task.trustScore}/100` : 'Pending'}</strong>
                  </div>
                  <div className="volunteer-context-item">
                    <FieldIcon>P</FieldIcon>
                    <span>Proof files</span>
                    <strong>{task.proofCount ? `${task.proofCount} attached` : 'None yet'}</strong>
                  </div>
                </div>

                <div className="volunteer-field-brief">
                  <div>
                    <FieldIcon>L</FieldIcon>
                    <span>Verify pickup or delivery at the listed location before submitting the report.</span>
                  </div>
                  <div>
                    <FieldIcon>R</FieldIcon>
                    <span>Capture recipient acknowledgment, safety notes, issue flags, and proof metadata.</span>
                  </div>
                  <div>
                    <FieldIcon>S</FieldIcon>
                    <span>Submit the field report as soon as the aid operation is complete.</span>
                  </div>
                </div>

                <div className="volunteer-task-actions">
                  {task.status !== 'completed' && task.status !== 'accepted' && (
                    <>
                      <button type="button" className="volunteer-task-action is-emerald" onClick={() => handleAccept(task.id)}>
                        Accept Task
                      </button>
                      <button type="button" className="volunteer-task-action is-rose" onClick={() => handleReject(task.id)}>
                        Reject
                      </button>
                    </>
                  )}
                  {task.status === 'accepted' && (
                    <>
                      <button
                        type="button"
                        className="volunteer-task-action is-emerald"
                        onClick={() => {
                          if (!navigator.geolocation) {
                            toast.error('Location is not supported on this device');
                            return;
                          }
                          navigator.geolocation.getCurrentPosition(
                            async (position) => {
                              try {
                                await volunteerService.updateLocation({
                                  lat: position.coords.latitude,
                                  lng: position.coords.longitude,
                                  accuracy: position.coords.accuracy,
                                  source: 'volunteer-browser',
                                  capturedAt: new Date(position.timestamp).toISOString()
                                });
                                toast.success('Live location shared');
                              } catch (error) {
                                toast.error(error.response?.data?.error || 'Could not share live location');
                              }
                            },
                            () => toast.error('Location permission is required')
                          );
                        }}
                      >
                        Share Live Location
                      </button>
                      <button
                        type="button"
                        className="volunteer-task-action is-amber"
                        onClick={() => navigate(`/submit-report?taskId=${task.id}&needyType=${task.needyType}`)}
                      >
                        Submit Report
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
