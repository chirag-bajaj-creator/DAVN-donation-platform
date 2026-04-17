import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import volunteerService from '../services/volunteerService';

function normalizeNeedyType(needyType) {
  if (needyType === 'NeededOrganization' || needyType === 'organization') {
    return 'NeededOrganization';
  }

  return 'NeededIndividual';
}

export default function SubmitReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const taskId = searchParams.get('taskId');
  const needyType = searchParams.get('needyType');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      description: '',
      findings: '',
      recommendations: '',
      verificationStatus: 'verified',
    },
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const onSubmit = async (data) => {
    if (!taskId) {
      toast.error('Task ID is required');
      return;
    }

    try {
      setLoading(true);
      const normalizedNeedyType = normalizeNeedyType(needyType);
      await volunteerService.submitReport(
        taskId,
        {
          trustScore:
            data.verificationStatus === 'verified'
              ? 85
              : data.verificationStatus === 'partial'
                ? 60
                : 25,
          recommendation:
            data.verificationStatus === 'verified'
              ? 'approve'
              : data.verificationStatus === 'partial'
                ? 'hold'
                : 'reject',
          verificationDetails: {
            description: data.description,
            findings: data.findings,
            recommendations: data.recommendations,
            verificationStatus: data.verificationStatus,
            photoName: photoFile?.name || null,
          },
          needy_type: normalizedNeedyType,
        },
        normalizedNeedyType
      );

      toast.success('Report submitted successfully!');
      navigate('/my-tasks');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to submit report';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #fce7f3 50%, #dcfce7 100%)', paddingTop: '48px', paddingBottom: '48px', paddingLeft: '16px', paddingRight: '16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)', padding: '40px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.5) 100%)', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #0284c7, #a855f7, #10b981) 1' }}>
        <button
          onClick={() => navigate('/my-tasks')}
          style={{ color: '#0284c7', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s', padding: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          ← Back to Tasks
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, marginBottom: '8px' }}>Submit Verification Report</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Document your volunteer work completion</p>
        </div>

        {!taskId && (
          <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)', border: '2px solid #a855f7', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#a855f7', margin: 0, fontWeight: '600' }}>⚠️ No task selected. Please select a task from My Tasks.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
              Work Description
            </label>
            <textarea
              placeholder="Describe the work you completed..."
              rows="4"
              {...register('description', {
                required: 'Work description is required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters',
                },
              })}
              style={{ width: '100%', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #0284c7, #a855f7) 1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.7)', transition: 'all 0.3s' }}
              onFocus={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)', e.target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)')}
              onBlur={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)', e.target.style.boxShadow = 'none')}
            />
            {errors.description && <p style={{ color: '#ec4899', fontSize: '13px', marginTop: '6px', margin: 0 }}>{errors.description.message}</p>}
          </div>

          {/* Findings */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
              Key Findings
            </label>
            <textarea
              placeholder="What did you find? What was the situation?"
              rows="4"
              {...register('findings', {
                required: 'Findings are required',
                minLength: {
                  value: 20,
                  message: 'Findings must be at least 20 characters',
                },
              })}
              style={{ width: '100%', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #a855f7, #ec4899) 1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.7)', transition: 'all 0.3s' }}
              onFocus={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)', e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)')}
              onBlur={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)', e.target.style.boxShadow = 'none')}
            />
            {errors.findings && <p style={{ color: '#ec4899', fontSize: '13px', marginTop: '6px' }}>{errors.findings.message}</p>}
          </div>

          {/* Recommendations */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', background: 'linear-gradient(135deg, #ec4899 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
              Recommendations
            </label>
            <textarea
              placeholder="What recommendations do you have for follow-up?"
              rows="4"
              {...register('recommendations', {
                required: 'Recommendations are required',
                minLength: {
                  value: 20,
                  message: 'Recommendations must be at least 20 characters',
                },
              })}
              style={{ width: '100%', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #ec4899, #10b981) 1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.7)', transition: 'all 0.3s' }}
              onFocus={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)', e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)')}
              onBlur={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)', e.target.style.boxShadow = 'none')}
            />
            {errors.recommendations && <p style={{ color: '#ec4899', fontSize: '13px', marginTop: '6px' }}>{errors.recommendations.message}</p>}
          </div>

          {/* Photo Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
              Proof Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              style={{ width: '100%', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #10b981, #0ea5e9) 1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.7)', transition: 'all 0.3s', cursor: 'pointer' }}
            />
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '6px' }}>Accepted: JPG, JPEG, PNG (max 5MB)</p>
            {photoFile && <p style={{ color: '#10b981', fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>✓ File selected: {photoFile.name}</p>}
          </div>

          {/* Verification Status */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', background: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
              Verification Status
            </label>
            <select
              {...register('verificationStatus')}
              style={{ width: '100%', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #0ea5e9, #a855f7) 1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.7)', transition: 'all 0.3s', color: '#111827' }}
            >
              <option value="verified">✓ Verified - Work Completed Successfully</option>
              <option value="partial">◐ Partial - Work Partially Completed</option>
              <option value="unable">✕ Unable to Verify - Incomplete</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !taskId}
            style={{ width: '100%', background: loading || !taskId ? '#d1d5db' : 'linear-gradient(135deg, #0284c7 0%, #a855f7 50%, #ec4899 100%)', color: '#fff', fontWeight: '600', paddingTop: '14px', paddingBottom: '14px', borderRadius: '10px', border: 'none', cursor: loading || !taskId ? 'not-allowed' : 'pointer', fontSize: '16px', transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)', opacity: loading || !taskId ? 0.7 : 1 }}
            onMouseEnter={(e) => !loading && !taskId && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 12px 28px rgba(2, 132, 199, 0.4)')}
            onMouseLeave={(e) => !loading && !taskId && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.3)')}
          >
            {loading ? '⏳ Submitting Report...' : '📤 Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
