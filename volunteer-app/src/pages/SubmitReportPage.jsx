import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      description: '',
      findings: '',
      recommendations: '',
      verificationStatus: 'verified',
    },
  });

  if (!isAuthenticated) {
    navigate('/');
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
    <Layout>
      <div className="volunteer-page-shell">
        <section className="volunteer-page-hero">
          <button type="button" className="volunteer-back-link" onClick={() => navigate('/my-tasks')}>
            Back to tasks
          </button>
          <span className="volunteer-page-kicker">Field report</span>
          <h1 className="volunteer-page-title">Submit Verification Report</h1>
          <p className="volunteer-page-copy">Document findings, completion status, and evidence from your assigned case.</p>
        </section>

        <section className="volunteer-form-card">
          {!taskId && (
            <div className="volunteer-alert">
              No task selected. Please select a task from My Tasks.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form-shell">
            <div>
              <label className="volunteer-label">Work Description</label>
              <textarea
                className="volunteer-textarea"
                placeholder="Describe the work you completed..."
                rows="4"
                {...register('description', {
                  required: 'Work description is required',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters',
                  },
                })}
              />
              {errors.description && <p className="volunteer-error">{errors.description.message}</p>}
            </div>

            <div>
              <label className="volunteer-label">Key Findings</label>
              <textarea
                className="volunteer-textarea"
                placeholder="What did you find? What was the situation?"
                rows="4"
                {...register('findings', {
                  required: 'Findings are required',
                  minLength: {
                    value: 20,
                    message: 'Findings must be at least 20 characters',
                  },
                })}
              />
              {errors.findings && <p className="volunteer-error">{errors.findings.message}</p>}
            </div>

            <div>
              <label className="volunteer-label">Recommendations</label>
              <textarea
                className="volunteer-textarea"
                placeholder="What recommendations do you have for follow-up?"
                rows="4"
                {...register('recommendations', {
                  required: 'Recommendations are required',
                  minLength: {
                    value: 20,
                    message: 'Recommendations must be at least 20 characters',
                  },
                })}
              />
              {errors.recommendations && <p className="volunteer-error">{errors.recommendations.message}</p>}
            </div>

            <div>
              <label className="volunteer-label">Proof Photo</label>
              <input
                className="volunteer-file"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(event) => setPhotoFile(event.target.files[0])}
              />
              <p className="volunteer-helper">Accepted: JPG, JPEG, PNG. The current API records the file name.</p>
              {photoFile && <p className="volunteer-form-success">File selected: {photoFile.name}</p>}
            </div>

            <div>
              <label className="volunteer-label">Verification Status</label>
              <select className="volunteer-select" {...register('verificationStatus')}>
                <option value="verified">Verified - Work Completed Successfully</option>
                <option value="partial">Partial - Work Partially Completed</option>
                <option value="unable">Unable to Verify - Incomplete</option>
              </select>
            </div>

            <button type="submit" disabled={loading || !taskId} className="volunteer-submit">
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}
