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
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Calculate password strength
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

      // Add address fields if provided
      if (data.street || data.city || data.state || data.zipCode) {
        userData.address = {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
        };
      }

      if (!data.terms) {
        setApiError('You must agree to the Terms & Conditions');
        return;
      }

      await registerUser(userData);
      reset();
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
        message = errorData.errors.map(e => e.message).join(', ');
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {apiError}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password (8+ chars) *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {password && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Strength</span>
              <span className="text-xs font-medium">
                {passwordStrength === 0 && 'Weak'}
                {passwordStrength <= 2 && passwordStrength > 0 && 'Fair'}
                {passwordStrength === 3 && 'Good'}
                {passwordStrength > 3 && 'Strong'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        {confirmPassword && password === confirmPassword && (
          <p className="text-green-600 text-sm mt-1">Passwords match</p>
        )}
      </div>

      {/* Address Fields (Optional) */}
      <details className="text-sm">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
          Address (Optional)
        </summary>
        <div className="space-y-3 mt-3 pl-2 border-l-2 border-gray-300">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Street
            </label>
            <input
              id="street"
              type="text"
              placeholder="123 Main St"
              {...register('street')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="New York"
                {...register('city')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                id="state"
                type="text"
                placeholder="NY"
                {...register('state')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code
            </label>
            <input
              id="zipCode"
              type="text"
              placeholder="10001"
              {...register('zipCode')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </details>

      {/* Terms & Conditions */}
      <div className="flex items-start space-x-2">
        <input
          id="terms"
          type="checkbox"
          {...register('terms', {
            required: 'You must agree to the Terms & Conditions',
          })}
          disabled={isLoading}
          className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:cursor-not-allowed"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the <a href="/terms" className="text-primary-600 hover:text-primary-700">Terms & Conditions</a> and <a href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
        </label>
      </div>
      {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isValid}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
