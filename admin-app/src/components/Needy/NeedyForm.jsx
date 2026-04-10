import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ImageUpload from '../Common/ImageUpload';

export default function NeedyForm({ type = 'individual', onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const needTypes = ['food', 'shelter', 'medical', 'basic_needs', 'education', 'employment'];
  const orgTypes = ['ngo', 'charity', 'trust', 'foundation', 'government', 'other'];

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);

      console.log('Raw form data:', data);

      // Build address object
      const address = {
        city: data.city?.trim() || '',
        street: data.street?.trim() || '',
        state: data.state?.trim() || '',
        zipCode: data.zipCode?.trim() || ''
      };

      // Build submission data based on type
      const submissionData = type === 'individual'
        ? {
            name: (data.name || '').trim(),
            phone: (data.phone || '').trim(),
            email: (data.email || '').trim(),
            address,
            type_of_need: (data.typeOfNeed || '').trim(),
            urgency: (data.urgency || 'medium').trim(),
            description: (data.description || '').trim()
          }
        : {
            org_name: (data.orgName || '').trim(),
            registration_number: (data.registrationNumber || '').trim(),
            org_type: (data.orgType || '').trim(),
            phone: (data.phone || '').trim(),
            address,
            contactPerson: {
              name: (data.contactName || '').trim(),
              phone: (data.contactPhone || '').trim(),
              email: (data.contactEmail || '').trim()
            },
            type_of_need: (data.typeOfNeed || '').trim(),
            urgency: (data.urgency || 'medium').trim(),
            description: (data.description || '').trim()
          };

      console.log('Final submission data:', submissionData);

      // Validate required fields
      if (!submissionData.name) throw new Error('Name is required');
      if (!submissionData.phone) throw new Error('Phone is required');
      if (!submissionData.address.city) throw new Error('City is required');
      if (!submissionData.type_of_need) throw new Error('Type of need is required');
      if (!submissionData.description) throw new Error('Description is required');

      await onSubmit(submissionData);
      toast.success('Registration submitted successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.details
        ? JSON.stringify(error.response.data.details)
        : error.response?.data?.message || error.message || 'Submission failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (data) => {
    console.log('===== FORM SUBMIT DEBUG =====');
    console.log('Raw form data from react-hook-form:', data);
    console.log('Type:', type);
    handleFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Individual Fields */}
      {type === 'individual' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Must not exceed 100 characters' },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Phone number must be exactly 10 digits',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
                placeholder="10-digit phone number"
                maxLength="10"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
              placeholder="your@email.com"
            />
          </div>
        </>
      )}

      {/* Organization Fields */}
      {type === 'organisation' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                Organisation Name *
              </label>
              <input
                id="orgName"
                type="text"
                {...register('orgName', {
                  required: 'Organisation name is required',
                  minLength: { value: 3, message: 'Must be at least 3 characters' },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
                placeholder="Enter organisation name"
              />
              {errors.orgName && <p className="text-red-500 text-sm mt-1">{errors.orgName.message}</p>}
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number *
              </label>
              <input
                id="registrationNumber"
                type="text"
                {...register('registrationNumber', {
                  required: 'Registration number is required',
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
                placeholder="Enter registration number"
              />
              {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="orgType" className="block text-sm font-medium text-gray-700">
                Organisation Type *
              </label>
              <select
                id="orgType"
                {...register('orgType', { required: 'Organisation type is required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
              >
                <option value="">Select type</option>
                {orgTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.orgType && <p className="text-red-500 text-sm mt-1">{errors.orgType.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Phone number must be exactly 10 digits',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
                placeholder="10-digit phone number"
                maxLength="10"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Contact Person (Optional)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                {...register('contactName')}
                disabled={isLoading}
                className="rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2 text-sm"
                placeholder="Contact name"
              />
              <input
                type="tel"
                {...register('contactPhone')}
                disabled={isLoading}
                className="rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2 text-sm"
                placeholder="Contact phone"
                maxLength="10"
              />
              <input
                type="email"
                {...register('contactEmail')}
                disabled={isLoading}
                className="rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2 text-sm"
                placeholder="Contact email"
              />
            </div>
          </div>
        </>
      )}

      {/* Common Address Fields */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Address *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="street" className="block text-xs font-medium text-gray-600">
              Street (Optional)
            </label>
            <input
              id="street"
              type="text"
              {...register('street')}
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
              placeholder="Street address"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-xs font-medium text-gray-600">
              City *
            </label>
            <input
              id="city"
              type="text"
              {...register('city', { required: 'City is required' })}
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
              placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-xs font-medium text-gray-600">
              State (Optional)
            </label>
            <input
              id="state"
              type="text"
              {...register('state')}
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
              placeholder="State"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-xs font-medium text-gray-600">
              Zip Code (Optional)
            </label>
            <input
              id="zipCode"
              type="text"
              {...register('zipCode')}
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
              placeholder="Zip code"
            />
          </div>
        </div>
      </div>

      {/* Type of Need */}
      <div>
        <label htmlFor="typeOfNeed" className="block text-sm font-medium text-gray-700">
          Type of Need *
        </label>
        <select
          id="typeOfNeed"
          {...register('typeOfNeed', { required: 'Type of need is required' })}
          disabled={isLoading}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
        >
          <option value="">Select type of need</option>
          {needTypes.map((need) => (
            <option key={need} value={need}>
              {need.charAt(0).toUpperCase() + need.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.typeOfNeed && <p className="text-red-500 text-sm mt-1">{errors.typeOfNeed.message}</p>}
      </div>

      {/* Urgency */}
      <div>
        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
          Urgency (Optional)
        </label>
        <select
          id="urgency"
          {...register('urgency')}
          disabled={isLoading}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
        >
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 50, message: 'Please provide at least 50 characters' },
            maxLength: { value: 2000, message: 'Description must not exceed 2000 characters' },
          })}
          disabled={isLoading}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-4 py-2.5"
          rows="5"
          placeholder="Describe your situation and what kind of help you need (minimum 50 characters)"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
      >
        {isLoading ? 'Submitting...' : 'Submit Registration'}
      </button>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-blue-800">
          ℹ️ Your registration will be reviewed by our admin team. A volunteer will be assigned to verify your information.
        </p>
      </div>
    </form>
  );
}
