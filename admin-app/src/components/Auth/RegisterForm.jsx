import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks';
import { validateEmail, validatePhone } from '../../utils/validation';
import { toast } from 'react-toastify';

export default function RegisterForm({ onSuccess }) {
  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange',
  });
  const { register: registerUser, loading: isLoading } = useAuth();
  const [apiError, setApiError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    setPasswordStrength(strength);
  }, [password]);

  const onSubmit = async (data) => {
    try {
      setApiError('');

      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      };

      if (data.street || data.city || data.state || data.zipCode) {
        userData.address = {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
        };
      }

      if (adminSecret && adminSecret.trim()) {
        console.log('Admin secret provided:', adminSecret);
        userData.adminSecret = adminSecret;
      }

      if (!data.terms) {
        setApiError('You must agree to the Terms & Conditions');
        return;
      }

      await registerUser(userData);
      reset();
      setAdminSecret('');
      toast.success('Registration successful! Redirecting to login...');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorData = error.response?.data;
      let message = 'Registration failed';

      if (errorData?.message) {
        message = errorData.message;
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        message = errorData.errors.map((entry) => entry.message).join(', ');
      } else if (error.message) {
        message = error.message;
      }

      console.log('Error details:', errorData);
      setApiError(message);
      toast.error(message);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 50, message: 'Name must not exceed 50 characters' },
          })}
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email', {
            required: 'Email is required',
            validate: validateEmail,
          })}
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Phone (10 digits) *
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="9876543210"
          {...register('phone', {
            required: 'Phone number is required',
            validate: validatePhone,
          })}
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password (8+ chars) *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              validate: (value) => {
                if (!value) return 'Password is required';
                if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
                if (!/[0-9]/.test(value)) return 'Password must contain number';
                if (!/[!@#$%^&*]/.test(value)) return 'Password must contain special character (!@#$%^&*)';
                return true;
              },
            })}
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            disabled={isLoading}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {password && (
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-slate-600">Strength</span>
              <span className="text-xs font-medium text-slate-700">
                {passwordStrength === 0 && 'Weak'}
                {passwordStrength <= 2 && passwordStrength > 0 && 'Fair'}
                {passwordStrength === 3 && 'Good'}
                {passwordStrength > 3 && 'Strong'}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
        {confirmPassword && password === confirmPassword && (
          <p className="mt-1 text-sm text-green-600">Passwords match</p>
        )}
      </div>

      <details className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700 hover:text-slate-900">
          Address (Optional)
        </summary>
        <div className="mt-4 space-y-3 border-l-2 border-slate-200 pl-3">
          <div className="space-y-1.5">
            <label htmlFor="street" className="block text-sm font-medium text-slate-700">
              Street
            </label>
            <input
              id="street"
              type="text"
              placeholder="123 Main St"
              {...register('street')}
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="New York"
                {...register('city')}
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="state" className="block text-sm font-medium text-slate-700">
                State
              </label>
              <input
                id="state"
                type="text"
                placeholder="NY"
                {...register('state')}
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700">
              Zip Code
            </label>
            <input
              id="zipCode"
              type="text"
              placeholder="10001"
              {...register('zipCode')}
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
            />
          </div>
        </div>
      </details>

      <div className="space-y-1.5">
        <label htmlFor="adminSecret" className="block text-sm font-medium text-slate-700">
          Admin Secret (Leave blank for regular user)
        </label>
        <input
          id="adminSecret"
          type="password"
          placeholder="Enter admin secret if registering as admin"
          value={adminSecret}
          onChange={(event) => setAdminSecret(event.target.value)}
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        <p className="mt-1 text-xs text-slate-500">Only required if you&apos;re registering as an admin</p>
      </div>

      <div className="flex items-start space-x-2">
        <input
          id="terms"
          type="checkbox"
          {...register('terms', {
            required: 'You must agree to the Terms & Conditions',
          })}
          disabled={isLoading}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
        />
        <label htmlFor="terms" className="text-sm text-slate-600">
          I agree to the <a href="/terms" className="text-primary-600 hover:text-primary-700">Terms & Conditions</a> and <a href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
        </label>
      </div>
      {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}

      <button
        type="submit"
        disabled={isLoading || !isValid}
        className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}
