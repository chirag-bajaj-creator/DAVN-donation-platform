import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import uploadService from '../../services/uploadService';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({ onImageUpload, disabled = false, folder = 'hravinder' }) {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, and WebP images are allowed');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) {
      setError('Please select an image first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError('File selection failed. Please try again.');
        return;
      }

      const result = await uploadService.uploadToCloudinary(file, folder);

      onImageUpload({
        url: result.url,
        publicId: result.publicId,
        name: result.originalName,
      });

      toast.success('Image uploaded successfully!');

      // Reset
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const message = err.message || 'Upload failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Image (Optional)
        </label>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            disabled
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
              : 'border-gray-300 hover:border-primary-500 hover:bg-blue-50 cursor-pointer'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            disabled={disabled || isLoading}
            className="hidden"
          />

          {!preview ? (
            <div
              onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
              className="space-y-2"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v4a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32 0l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 28l3.172-3.172a4 4 0 015.656 0L28 28"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-600">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG or WebP • Max 5MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded"
              />
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isLoading || disabled}
                  className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? 'Uploading...' : 'Upload Image'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading || disabled}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Help Text */}
        <p className="text-xs text-gray-500">
          Images are stored securely via Cloudinary. JPG, PNG, and WebP formats only. Maximum file size is 5MB.
        </p>
      </div>
    </div>
  );
}
