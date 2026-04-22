import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import volunteerService from '../services/volunteerService';

export default function UnspecializedRegisterPage({ embedded = false, onSuccess, onLogin }) {
  const navigate = useNavigate();
  const { register: registerUser, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      availability: 'weekends',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const normalizedEmail = data.email.trim().toLowerCase();

      await registerUser({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: normalizedEmail,
        phone: data.phone,
        password: data.password,
      });

      await volunteerService.registerUnspecialized({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        availability: data.availability,
      });

      await login({ email: normalizedEmail, password: data.password }, { allowedRoles: ['volunteer'] });

      toast.success('Registration successful! Welcome to Volunteer Network!');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details.map((detail) => detail.message).join(', ');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <>
        <div className="volunteer-auth-header">
          <h2>General Volunteer</h2>
          <p>Join the field network for flexible verification work.</p>
        </div>

        <div className="volunteer-auth-body">
          <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form-shell">
            <div className="volunteer-form-grid">
              <div>
                <label className="volunteer-label">First Name</label>
                <input className="volunteer-input" type="text" placeholder="John" {...register('firstName', { required: 'First name is required' })} />
                {errors.firstName && <p className="volunteer-error">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Last Name</label>
                <input className="volunteer-input" type="text" placeholder="Doe" {...register('lastName', { required: 'Last name is required' })} />
                {errors.lastName && <p className="volunteer-error">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Email</label>
                <input
                  className="volunteer-input"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                  })}
                />
                {errors.email && <p className="volunteer-error">{errors.email.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Phone</label>
                <input className="volunteer-input" type="tel" placeholder="9876543210" {...register('phone', { required: 'Phone number is required' })} />
                {errors.phone && <p className="volunteer-error">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Availability</label>
                <select className="volunteer-select" {...register('availability', { required: 'Please select availability' })}>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                  <option value="evenings">Evenings</option>
                </select>
                {errors.availability && <p className="volunteer-error">{errors.availability.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Password</label>
                <input
                  className="volunteer-input"
                  type="password"
                  placeholder="Enter a strong password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                />
                {errors.password && <p className="volunteer-error">{errors.password.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Confirm Password</label>
                <input
                  className="volunteer-input"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && <p className="volunteer-error">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="volunteer-submit">
              {loading ? 'Registering...' : 'Register as General Volunteer'}
            </button>
          </form>

          <p className="volunteer-auth-note">
            Already have an account?{' '}
            {embedded && onLogin ? (
              <button type="button" className="volunteer-auth-link volunteer-inline-button" onClick={onLogin}>
                Login here
              </button>
            ) : (
              <Link className="volunteer-auth-link" to="/">Login here</Link>
            )}
          </p>
        </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="volunteer-app-shell volunteer-auth-backdrop">
      <div className="volunteer-auth-card is-compact">
        {content}
      </div>
    </div>
  );
}
