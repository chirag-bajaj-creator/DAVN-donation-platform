import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterTypePage({ embedded = false, onSelectSpecialized, onSelectGeneral, onLogin }) {
  const navigate = useNavigate();

  const content = (
    <>
        <div className="volunteer-auth-header">
          <h2>Choose Your Role</h2>
          <p>Select the type of volunteer work you want to do</p>
        </div>

        <div className="volunteer-auth-body">
          <div className="volunteer-auth-grid">
            <div className="volunteer-choice-grid">
              <button type="button" className="volunteer-choice-card is-forest" onClick={() => (embedded ? onSelectSpecialized?.() : navigate('/'))}>
                <h3>Specialized Volunteer</h3>
                <p>Share certifications and experience for role-matched assignments.</p>
              </button>

              <button type="button" className="volunteer-choice-card is-gold" onClick={() => (embedded ? onSelectGeneral?.() : navigate('/'))}>
                <h3>General Volunteer</h3>
                <p>Join the field network and help with flexible community verification work.</p>
              </button>
            </div>

            <p className="volunteer-auth-note" style={{ textAlign: 'center', marginTop: '4px' }}>
              Already have an account?{' '}
              {embedded && onLogin ? (
                <button type="button" className="volunteer-auth-link volunteer-inline-button" onClick={onLogin}>
                  Login here
                </button>
              ) : (
                <Link to="/" className="volunteer-auth-link">Login here</Link>
              )}
            </p>
          </div>
        </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="volunteer-auth-backdrop">
      <div className="volunteer-auth-card is-compact">
        {content}
      </div>
    </div>
  );
}
