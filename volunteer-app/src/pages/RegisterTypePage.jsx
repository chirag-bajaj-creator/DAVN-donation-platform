import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterTypePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 40px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '360px',
        overflow: 'hidden',
        animation: 'slideIn 0.25s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to bottom, #0284c7 0%, #0ea5e9 50%, #a855f7 100%)',
          color: '#fff',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>Choose Your Role</h2>
          <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Select the type of volunteer work</p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Role</h1>
            <p className="text-gray-600 mt-2">Select the type of volunteer work you want to do</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Specialized */}
            <button
              onClick={() => navigate('/register/specialized')}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Specialized</h3>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>With certifications</p>
            </button>

            {/* Unspecialized */}
            <button
              onClick={() => navigate('/register/unspecialized')}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>General</h3>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>Anyone can help</p>
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            marginTop: '16px',
            fontSize: '12px'
          }}>
            Already have an account?{' '}
            <a href="/login" style={{
              color: '#0284c7',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Login here
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
