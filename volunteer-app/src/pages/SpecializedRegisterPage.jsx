import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import volunteerService from '../services/volunteerService';

export default function SpecializedRegisterPage({ embedded = false, onSuccess, onLogin }) {
  const navigate = useNavigate();
  const { register: registerUser, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      specialization: '',
      experience: '',
    },
  });

  const password = watch('password');
  const normalizePhone = (phone) => phone.replace(/\D/g, '');

  const specializationOptions = [
    { value: 'Medical', label: 'Doctor / Medical' },
    { value: 'Logistics', label: 'Engineer / Logistics' },
    { value: 'Education', label: 'Teacher / Education' },
    { value: 'Management', label: 'Counselor / Management' },
    { value: 'Other', label: 'Plumber' },
    { value: 'Other', label: 'Electrician' },
    { value: 'Other', label: 'Carpenter' },
  ];

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(data.phone);

    if (normalizedPhone.length !== 10) {
      toast.error('Phone must be a 10-digit number');
      return;
    }

    try {
      setLoading(true);

      try {
        await registerUser({
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          password: data.password,
        });
      } catch (authError) {
        const authCode = authError.response?.data?.code;
        const authMessage = authError.response?.data?.error;

        if (authCode === 'USER_EXISTS' && authMessage === 'Email already registered') {
          try {
            await login({ email: normalizedEmail, password: data.password }, { allowedRoles: [] });
          } catch (loginError) {
            if (loginError.response?.data?.code === 'INVALID_CREDENTIALS') {
              throw new Error('An account with this email already exists with a different password.');
            }
            throw loginError;
          }
        } else {
          throw authError;
        }
      }

      await volunteerService.registerSpecialized({
        specialization: data.specialization,
        experience: data.experience,
        documents: docFile ? [{ filename: docFile.name }] : [],
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
      if (error.message && !error.response) {
        errorMessage = error.message;
      } else if (error.response?.data?.details) {
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
          <h2>Specialized Volunteer</h2>
          <p>Share your expertise for structured field verification.</p>
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
                <input
                  className="volunteer-input"
                  type="tel"
                  placeholder="9876543210"
                  {...register('phone', {
                    required: 'Phone number is required',
                    validate: (value) => normalizePhone(value).length === 10 || 'Phone must be a 10-digit number',
                  })}
                />
                {errors.phone && <p className="volunteer-error">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Specialization</label>
                <select className="volunteer-select" {...register('specialization', { required: 'Please select a specialization' })}>
                  <option value="">Choose specialization...</option>
                  {specializationOptions.map((option) => (
                    <option key={`${option.value}-${option.label}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.specialization && <p className="volunteer-error">{errors.specialization.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Years of Experience</label>
                <input
                  className="volunteer-input"
                  type="number"
                  placeholder="5"
                  {...register('experience', {
                    required: 'Experience is required',
                    min: { value: 0, message: 'Experience cannot be negative' },
                  })}
                />
                {errors.experience && <p className="volunteer-error">{errors.experience.message}</p>}
              </div>
              <div>
                <label className="volunteer-label">Certification Document</label>
                <input className="volunteer-file" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(event) => setDocFile(event.target.files[0])} />
                <p className="volunteer-helper">Accepted: PDF, DOC, DOCX, JPG, PNG. The current API records the file name during registration.</p>
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
              {loading ? 'Registering...' : 'Register as Specialist'}
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
