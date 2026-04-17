import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data, { allowedRoles: ['volunteer'] });
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage =
        error.message ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '360px',
          overflow: 'hidden',
          animation: 'slideIn 0.25s ease-out'
        }}
      >
        {/* Header with gradient */}
        <div style={{
          background: 'linear-gradient(to bottom, #0284c7 0%, #0ea5e9 50%, #a855f7 100%)',
          color: '#fff',
          padding: '24px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>Volunteer Sign In</h2>
          <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Volunteer Verification Portal</p>
        </div>

        {/* Form Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="volunteer@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  backgroundColor: '#f9fafb',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0284c7';
                  e.target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  backgroundColor: '#f9fafb',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0284c7';
                  e.target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>}
            </div>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff',
                border: 'none',
                background: loading ? '#d1d5db' : 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '12px',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1,
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.boxShadow = '0 6px 16px rgba(2, 132, 199, 0.4)')}
              onMouseLeave={(e) => !loading && (e.target.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.3)')}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            marginTop: '12px',
            fontSize: '12px'
          }}>
            Don't have an account?{' '}
            <Link to="/register-type" style={{
              color: '#0284c7',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Register here
            </Link>
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
