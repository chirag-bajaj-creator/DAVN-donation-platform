import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function VerificationForm({ needyId, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      await onSubmit({ ...data, needyId });
      toast.success('Verification submitted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Submission failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Verification Status
        </label>
        <select
          id="status"
          {...register('status', { required: 'Status is required' })}
          disabled={isLoading}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100"
        >
          <option value="">Select status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending Review</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
          Verification Comments
        </label>
        <textarea
          id="comments"
          {...register('comments', { required: 'Comments are required' })}
          disabled={isLoading}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100"
          rows="5"
          placeholder="Provide detailed verification comments"
        />
        {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded font-medium hover:bg-primary-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Submitting...' : 'Submit Verification'}
      </button>
    </form>
  );
}
