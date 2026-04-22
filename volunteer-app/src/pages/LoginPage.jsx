import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage({ embedded = false, onSuccess, onRegister }) {
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
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
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

  const content = (
    <>
      <div className="volunteer-auth-header">
        <h2>Volunteer Sign In</h2>
        <p>Volunteer verification portal</p>
      </div>

      <div className="volunteer-auth-body">
        <div className="volunteer-auth-grid">
          <div>
            <label className="volunteer-label" htmlFor="volunteer-login-email">Email</label>
            <input
              id="volunteer-login-email"
              type="email"
              placeholder="volunteer@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="volunteer-input"
            />
            {errors.email && <p className="volunteer-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="volunteer-label" htmlFor="volunteer-login-password">Password</label>
            <input
              id="volunteer-login-password"
              type="password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="volunteer-input"
            />
            {errors.password && <p className="volunteer-error">{errors.password.message}</p>}
          </div>

          <button type="button" onClick={handleSubmit(onSubmit)} disabled={loading} className="volunteer-auth-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="volunteer-auth-note" style={{ textAlign: 'center', marginTop: '2px' }}>
            Don&apos;t have an account?{' '}
            {embedded && onRegister ? (
              <button type="button" className="volunteer-auth-link volunteer-inline-button" onClick={onRegister}>
                Register here
              </button>
            ) : (
              <Link to="/" className="volunteer-auth-link">Register here</Link>
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
      <div className="volunteer-auth-card">
        {content}
      </div>
    </div>
  );
}
