import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import volunteerService from '../services/volunteerService';

export default function SpecializedRegisterPage() {
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

      // Step 1: Create the user account. If a previous attempt already created
      // it, log in and continue the volunteer registration flow.
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
            await login({
              email: normalizedEmail,
              password: data.password,
            }, { allowedRoles: [] });
          } catch (loginError) {
            if (loginError.response?.data?.code === 'INVALID_CREDENTIALS') {
              throw new Error('An account with this email already exists with a different password. Log in with the existing account or use a different email.');
            }

            throw loginError;
          }
        } else {
          throw authError;
        }
      }

      // Step 2: Register as specialized volunteer using the authenticated user.
      await volunteerService.registerSpecialized({
        specialization: data.specialization,
        experience: data.experience,
        documents: docFile ? [{ filename: docFile.name }] : [],
      });

      await login({
        email: normalizedEmail,
        password: data.password,
      }, { allowedRoles: ['volunteer'] });

      toast.success('Registration successful! Welcome to Volunteer Network!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message && !error.response) {
        errorMessage = error.message;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details.map(d => d.message).join(', ');
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
      padding: '80px 40px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '380px',
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
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>Specialized Volunteer</h2>
          <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Share your expertise</p>
        </div>

        {/* Form */}
        <div style={{ padding: '24px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                placeholder="John"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Contact Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              placeholder="9876543210"
              {...register('phone', {
                required: 'Phone number is required',
                validate: (value) => normalizePhone(value).length === 10 || 'Phone must be a 10-digit number',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          {/* Specialization Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <select
              {...register('specialization', { required: 'Please select a specialization' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose specialization...</option>
              {specializationOptions.map((option) => (
                <option key={`${option.value}-${option.label}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              placeholder="5"
              {...register('experience', {
                required: 'Experience is required',
                min: { value: 0, message: 'Experience cannot be negative' },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certification Document</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setDocFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-gray-500 text-sm mt-1">Accepted: PDF, DOC, DOCX, JPG, PNG. The current API does not store this file during registration yet.</p>
          </div>

          {/* Password Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter a strong password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            marginTop: '12px',
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
