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

  return {
    id,
    key: id ? `${needyType}-${id}` : null,
    title: task.title || task.name || task.org_name || 'Untitled Case',
    description: task.description || 'No description available',
    status: rawStatus === 'verified' ? 'completed' : rawStatus,
    priority: task.priority || task.urgency || 'medium',
    location: task.location || formatLocation(task.address),
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

export default function MyTasksPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    <strong>{task.priority}</strong>
                  </div>
                  <div className="volunteer-meta-item">
                    <span>Location</span>
                    <strong>{task.location}</strong>
                  </div>
                  <div className="volunteer-meta-item">
                    <span>Assigned</span>
                    <strong>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</strong>
                  </div>
                  <div className="volunteer-meta-item">
                    <span>Deadline</span>
                    <strong>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</strong>
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
                    <button
                      type="button"
                      className="volunteer-task-action is-amber"
                      onClick={() => navigate(`/submit-report?taskId=${task.id}&needyType=${task.needyType}`)}
                    >
                      Submit Report
                    </button>
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
