import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import volunteerService from '../services/volunteerService';

export default function MyTasksPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await volunteerService.getAssignedCases();
        setTasks(response.data || []);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated, navigate]);

  const handleAccept = async (caseId) => {
    try {
      await volunteerService.acceptCase(caseId);
      toast.success('Task accepted successfully');
      setTasks(tasks.map(t => t.id === caseId ? { ...t, status: 'accepted' } : t));
    } catch (error) {
      toast.error('Failed to accept task');
    }
  };

  const handleReject = async (caseId) => {
    try {
      await volunteerService.rejectCase(caseId);
      toast.success('Task rejected');
      setTasks(tasks.filter(t => t.id !== caseId));
    } catch (error) {
      toast.error('Failed to reject task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4 animate-spin">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f9ff 0%, #fce7f3 100%)' }}>
      <header style={{ background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 50%, #ec4899 100%)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ color: '#fff', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s', padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>My Assigned Tasks</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>Cases assigned to you that need verification</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tasks.length === 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', padding: '48px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1), rgba(168, 85, 247, 0.1))', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px', position: 'relative', zIndex: 1 }}>No tasks assigned yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px', position: 'relative', zIndex: 1 }}>Check back later for new volunteer opportunities.</p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)', color: '#fff', fontWeight: '600', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.3)')}
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {tasks.map((task) => (
              <div key={task.id} style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '24px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.5) 100%)', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #0284c7, #a855f7) 1', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(14, 165, 233, 0.08))', borderRadius: '50%', pointerEvents: 'none' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '4px' }}>{task.title}</h3>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>{task.description}</p>
                  </div>
                  <span style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '4px', paddingBottom: '4px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: task.status === 'completed' ? 'linear-gradient(135deg, #10b981, #059669)' : task.status === 'accepted' ? 'linear-gradient(135deg, #0284c7, #0ea5e9)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', whiteSpace: 'nowrap' }}>
                    {task.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Priority</p>
                    <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{task.priority}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Location</p>
                    <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{task.location}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Assigned Date</p>
                    <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Deadline</p>
                    <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                  {task.status !== 'completed' && task.status !== 'accepted' && (
                    <>
                      <button
                        onClick={() => handleAccept(task.id)}
                        style={{ flex: 1, background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)', color: '#fff', fontWeight: '600', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.3)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.2)')}
                      >
                        ✓ Accept Task
                      </button>
                      <button
                        onClick={() => handleReject(task.id)}
                        style={{ flex: 1, background: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)', color: '#fff', fontWeight: '600', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 20px rgba(236, 72, 153, 0.3)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.2)')}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {task.status === 'accepted' && (
                    <button
                      onClick={() => navigate(`/submit-report?taskId=${task.id}`)}
                      style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: '600', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)')}
                    >
                      📄 Submit Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
