import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ImageUpload from '../Common/ImageUpload';

export default function DonationForm({ type = 'cash', onSubmit }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Map 'basics' to 'basic_needs' for backend
      const donationType = type === 'basics' ? 'basic_needs' : type;

      // Convert items string to array
      let itemsArray = undefined;
      if (data.items) {
        itemsArray = data.items
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }

      // Restructure form data to match backend schema
      const submissionData = {
        type: donationType,
        amount: Number(data.amount) || 0, // Ensure it's a number
        details: {
          currency: 'INR',
          name: data.name,
          phone: data.phone,
          address: data.address,
          foodType: data.foodType,
          quantity: data.quantity ? Number(data.quantity) : undefined, // Convert to number
          shelterType: data.shelterType,
          details: data.details,
          medicineType: data.medicineType,
          hasDocPermission: data.hasDocPermission,
          medicalDetails: data.medicalDetails,
          items: itemsArray, // Now an array
          condition: data.condition
        }
      };

      if (uploadedImage) {
        submissionData.details.imageUrl = uploadedImage.url;
        submissionData.details.imagePublicId = uploadedImage.publicId;
      }

      await onSubmit(submissionData);
      toast.success('Donation submitted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Submission failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFields = () => {
    const commonFields = (
      <>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            disabled={isLoading}
            className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
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
                message: 'Phone number must be 10 digits'
              }
            })}
            disabled={isLoading}
            className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
            placeholder="Enter 10-digit phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
      </>
    );

    switch (type) {
      case 'cash':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Donation Amount (₹) *
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                {...register('amount', {
                  required: 'Amount is required',
                  validate: {
                    positive: (value) => value > 0 || 'Amount must be greater than 0',
                    maxValue: (value) => value <= 999999999 || 'Amount is too large',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="Enter donation amount"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-800">
                ℹ️ After submission, you'll receive a QR code to complete payment securely.
              </p>
            </div>
          </>
        );

      case 'food':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Estimated Value (₹) *
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                {...register('amount', {
                  required: 'Estimated value is required',
                  validate: {
                    positive: (value) => value > 0 || 'Value must be greater than 0',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="Estimated value of food donation"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address (Pickup Location) *
              </label>
              <textarea
                id="address"
                {...register('address', { required: 'Address is required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                rows="3"
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label htmlFor="foodType" className="block text-sm font-medium text-gray-700">
                Type of Food *
              </label>
              <input
                id="foodType"
                type="text"
                {...register('foodType', { required: 'Food type is required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="e.g., Cooked rice, Packaged biscuits, Fresh vegetables"
              />
              {errors.foodType && <p className="text-red-500 text-sm mt-1">{errors.foodType.message}</p>}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity (in units) *
              </label>
              <input
                id="quantity"
                type="number"
                step="1"
                min="1"
                {...register('quantity', {
                  required: 'Quantity is required',
                  validate: {
                    positive: (value) => value > 0 || 'Quantity must be greater than 0',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="e.g., 10, 50, 5"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>
          </>
        );

      case 'shelter':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Estimated Value (₹) *
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                {...register('amount', {
                  required: 'Estimated value is required',
                  validate: {
                    positive: (value) => value > 0 || 'Value must be greater than 0',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="Estimated value of shelter support"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="shelterType" className="block text-sm font-medium text-gray-700">
                Type of Shelter *
              </label>
              <select
                id="shelterType"
                {...register('shelterType', { required: 'Shelter type is required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
              >
                <option value="">Select shelter type</option>
                <option value="room">Single Room</option>
                <option value="house">Full House</option>
                <option value="temporary">Temporary Stay</option>
              </select>
              {errors.shelterType && <p className="text-red-500 text-sm mt-1">{errors.shelterType.message}</p>}
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                Additional Details *
              </label>
              <textarea
                id="details"
                {...register('details', { required: 'Details are required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                rows="3"
                placeholder="Describe the shelter - location, capacity, amenities, duration (if temporary)"
              />
              {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>}
            </div>
          </>
        );

      case 'medical':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Estimated Value (₹) *
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                {...register('amount', {
                  required: 'Estimated value is required',
                  validate: {
                    positive: (value) => value > 0 || 'Value must be greater than 0',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="Estimated value of medical support"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="medicineType" className="block text-sm font-medium text-gray-700">
                Type of Medicine/Support *
              </label>
              <input
                id="medicineType"
                type="text"
                {...register('medicineType', { required: 'Medicine type is required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="e.g., Antibiotics, Pain relief, Medical equipment"
              />
              {errors.medicineType && <p className="text-red-500 text-sm mt-1">{errors.medicineType.message}</p>}
            </div>

            <div>
              <label htmlFor="hasDocPermission" className="flex items-center space-x-2">
                <input
                  id="hasDocPermission"
                  type="checkbox"
                  {...register('hasDocPermission')}
                  disabled={isLoading}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Doctor Permission Available</span>
              </label>
            </div>

            <div>
              <label htmlFor="medicalDetails" className="block text-sm font-medium text-gray-700">
                Details *
              </label>
              <textarea
                id="medicalDetails"
                {...register('medicalDetails', { required: 'Details are required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                rows="3"
                placeholder="Describe the medical support you're offering"
              />
              {errors.medicalDetails && <p className="text-red-500 text-sm mt-1">{errors.medicalDetails.message}</p>}
            </div>
          </>
        );

      case 'basics':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Estimated Value (₹) *
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                {...register('amount', {
                  required: 'Estimated value is required',
                  validate: {
                    positive: (value) => value > 0 || 'Value must be greater than 0',
                  },
                })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                placeholder="Estimated value of items donated"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="items" className="block text-sm font-medium text-gray-700">
                Items to Donate * (One item per line)
              </label>
              <textarea
                id="items"
                {...register('items', { required: 'Items list is required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
                rows="4"
                placeholder="List items (one per line):&#10;Clothes - 10 shirts&#10;Blankets - 5&#10;Hygiene items - 10 packets"
              />
              {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items.message}</p>}
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                Condition of Items *
              </label>
              <select
                id="condition"
                {...register('condition', { required: 'Condition is required' })}
                disabled={isLoading}
                className="mt-1 block w-full rounded border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 px-3 py-2"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
              {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {renderFields()}

      <ImageUpload
        onImageUpload={setUploadedImage}
        disabled={isLoading}
        folder="donations"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded font-medium hover:bg-primary-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : 'Submit Donation'}
      </button>
    </form>
  );
}
