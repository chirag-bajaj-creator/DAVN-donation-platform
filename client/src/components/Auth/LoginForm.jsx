import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks';
import { validateEmail } from '../../utils/validation';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: localStorage.getItem('rememberEmail') || '',
      rememberMe: !!localStorage.getItem('rememberEmail'),
    },
  });
  const { login, loading: isLoading, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await login({ email: data.email, password: data.password });

      // Handle remember email
      if (data.rememberMe) {
        localStorage.setItem('rememberEmail', data.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const errorData = error.response?.data;
      let message = 'Login failed';

      if (error.message) {
        message = error.message;
      } else if (errorData?.message) {
        message = errorData.message;
      } else if (errorData?.error) {
        message = errorData.error;
      }

      console.log('Full error details:', {
        status: error.response?.status,
        data: errorData,
        message: message,
      });

      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {apiError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 1, message: 'Password is required' },
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
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="rememberMe" className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            disabled={isLoading}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:cursor-not-allowed"
          />
          <span className="ml-2 text-sm text-gray-600">Remember email</span>
        </label>
      </div>

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
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
}
