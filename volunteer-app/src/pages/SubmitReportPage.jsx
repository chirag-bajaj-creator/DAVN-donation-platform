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

function buildTrustScore(data, issueFlags) {
  let score = data.aidOutcome === 'completed' ? 88 : data.aidOutcome === 'partial' ? 62 : 30;

  if (data.recipientAcknowledgment === 'confirmed') score += 5;
  if (data.recipientAcknowledgment === 'not_available') score -= 8;
  if (issueFlags.length > 0) score -= Math.min(issueFlags.length * 8, 24);
  if (data.followUpRecommendation === 'urgent_escalation') score -= 10;

  return Math.max(0, Math.min(100, score));
}

function buildRecommendation(data, issueFlags) {
  if (data.aidOutcome === 'failed' || issueFlags.includes('safety_risk')) return 'reject';
  if (data.aidOutcome === 'partial' || data.followUpRecommendation !== 'none' || issueFlags.length > 0) return 'hold';
  return 'approve';
}

const ReportIcon = ({ children }) => (
  <span className="volunteer-report-icon" aria-hidden="true">{children}</span>
);

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
      aidOutcome: 'completed',
      recipientAcknowledgment: 'confirmed',
      qualitySafetyNotes: '',
      issueFlags: [],
      followUpRecommendation: 'none',
      proofType: 'photo',
      proofReference: '',
      proofCapturedAt: '',
      verificationStatus: 'Aid operation completed and evidence recorded for admin review.',
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
      const issueFlags = Array.isArray(data.issueFlags) ? data.issueFlags : [];
      const trustScore = buildTrustScore(data, issueFlags);
      const recommendation = buildRecommendation(data, issueFlags);
      const proofMetadata = {
        type: data.proofType,
        reference: data.proofReference,
        capturedAt: data.proofCapturedAt || null,
        fileName: photoFile?.name || null,
        fileType: photoFile?.type || null,
        fileSize: photoFile?.size || null,
      };

      await volunteerService.submitReport(
        taskId,
        {
          trustScore,
          recommendation,
          verificationDetails: {
            documentVerified: Boolean(photoFile || data.proofReference),
            addressVerified: data.aidOutcome !== 'failed',
            identityVerified: data.recipientAcknowledgment === 'confirmed',
            comments: [
              `Outcome: ${data.aidOutcome}`,
              `Acknowledgment: ${data.recipientAcknowledgment}`,
              `Quality/Safety: ${data.qualitySafetyNotes}`,
              `Follow-up: ${data.followUpRecommendation}`,
              `Proof: ${data.proofType} | ${data.proofReference} | ${data.proofCapturedAt || 'time not recorded'} | ${photoFile?.name || 'no file metadata'}`,
            ].join('\n'),
            issues: issueFlags,
            description: data.description,
            findings: data.findings,
            recommendations: data.followUpRecommendation,
            aidOutcome: data.aidOutcome,
            recipientAcknowledgment: data.recipientAcknowledgment,
            qualitySafetyNotes: data.qualitySafetyNotes,
            issueFlags,
            followUpRecommendation: data.followUpRecommendation,
            proofMetadata,
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
            <div className="volunteer-report-section">
              <div className="volunteer-report-heading">
                <ReportIcon>O</ReportIcon>
                <div>
                  <h2>Operation Outcome</h2>
                  <p>Record whether the aid pickup or delivery was completed in the field.</p>
                </div>
              </div>

              <div className="volunteer-form-grid">
                <div>
                  <label className="volunteer-label">Pickup / Delivery Outcome</label>
                  <select className="volunteer-select" {...register('aidOutcome', { required: 'Outcome is required' })}>
                    <option value="completed">Completed - Aid handed over or pickup completed</option>
                    <option value="partial">Partial - Some aid delivered or condition changed</option>
                    <option value="failed">Failed - Could not complete the operation</option>
                  </select>
                  {errors.aidOutcome && <p className="volunteer-error">{errors.aidOutcome.message}</p>}
                </div>

                <div>
                  <label className="volunteer-label">Recipient Acknowledgment</label>
                  <select
                    className="volunteer-select"
                    {...register('recipientAcknowledgment', { required: 'Acknowledgment is required' })}
                  >
                    <option value="confirmed">Confirmed by recipient / authorized contact</option>
                    <option value="proxy_confirmed">Confirmed by caregiver, staff, or local witness</option>
                    <option value="not_available">Not available at visit time</option>
                    <option value="refused">Recipient refused or could not acknowledge</option>
                  </select>
                  {errors.recipientAcknowledgment && <p className="volunteer-error">{errors.recipientAcknowledgment.message}</p>}
                </div>
              </div>
            </div>

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
              <label className="volunteer-label">Field Findings</label>
              <textarea
                className="volunteer-textarea"
                placeholder="What did you find at the location? Include recipient condition, site condition, and handover context."
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

            <div className="volunteer-report-section">
              <div className="volunteer-report-heading">
                <ReportIcon>Q</ReportIcon>
                <div>
                  <h2>Quality, Safety, and Issues</h2>
                  <p>Flag anything the admin team must verify before closing the case.</p>
                </div>
              </div>

              <div>
                <label className="volunteer-label">Quality / Safety Notes</label>
                <textarea
                  className="volunteer-textarea"
                  placeholder="Mention item quality, food freshness, package damage, unsafe access, hygiene concerns, or no issues found."
                  rows="4"
                  {...register('qualitySafetyNotes', {
                    required: 'Quality and safety notes are required',
                    minLength: {
                      value: 15,
                      message: 'Notes must be at least 15 characters',
                    },
                  })}
                />
                {errors.qualitySafetyNotes && <p className="volunteer-error">{errors.qualitySafetyNotes.message}</p>}
              </div>

              <fieldset className="volunteer-fieldset">
                <legend>Issue Flags</legend>
                <label><input type="checkbox" value="recipient_not_found" {...register('issueFlags')} /> Recipient not found</label>
                <label><input type="checkbox" value="address_mismatch" {...register('issueFlags')} /> Address mismatch</label>
                <label><input type="checkbox" value="quality_concern" {...register('issueFlags')} /> Quality concern</label>
                <label><input type="checkbox" value="safety_risk" {...register('issueFlags')} /> Safety risk</label>
                <label><input type="checkbox" value="extra_need_identified" {...register('issueFlags')} /> Extra need identified</label>
              </fieldset>
            </div>

            <div className="volunteer-report-section">
              <div className="volunteer-report-heading">
                <ReportIcon>F</ReportIcon>
                <div>
                  <h2>Follow-up Recommendation</h2>
                  <p>Tell admins what should happen after this report.</p>
                </div>
              </div>

              <label className="volunteer-label">Recommended Next Step</label>
              <select className="volunteer-select" {...register('followUpRecommendation', { required: 'Follow-up recommendation is required' })}>
                <option value="none">No follow-up needed - case can close</option>
                <option value="second_visit">Second visit recommended</option>
                <option value="more_aid_required">More aid required</option>
                <option value="urgent_escalation">Urgent admin escalation required</option>
                <option value="recipient_details_update">Recipient details need correction</option>
              </select>
              {errors.followUpRecommendation && <p className="volunteer-error">{errors.followUpRecommendation.message}</p>}
            </div>

            <div className="volunteer-report-section">
              <div className="volunteer-report-heading">
                <ReportIcon>P</ReportIcon>
                <div>
                  <h2>Proof Metadata</h2>
                  <p>The current API records metadata; upload transport can be wired later without changing this UX.</p>
                </div>
              </div>

              <div className="volunteer-form-grid">
                <div>
                  <label className="volunteer-label">Proof Type</label>
                  <select className="volunteer-select" {...register('proofType', { required: 'Proof type is required' })}>
                    <option value="photo">Photo</option>
                    <option value="signature">Recipient signature</option>
                    <option value="document">Document reference</option>
                    <option value="witness_note">Witness note</option>
                  </select>
                  {errors.proofType && <p className="volunteer-error">{errors.proofType.message}</p>}
                </div>

                <div>
                  <label className="volunteer-label">Proof Captured At</label>
                  <input className="volunteer-input" type="datetime-local" {...register('proofCapturedAt')} />
                </div>
              </div>

              <div>
                <label className="volunteer-label">Proof Reference / Receipt / Witness</label>
                <input
                  className="volunteer-input"
                  placeholder="Receipt number, local witness name, photo reference, or handover note"
                  {...register('proofReference', {
                    required: 'Proof reference is required',
                    minLength: {
                      value: 3,
                      message: 'Proof reference must be at least 3 characters',
                    },
                  })}
                />
                {errors.proofReference && <p className="volunteer-error">{errors.proofReference.message}</p>}
              </div>

              <div>
                <label className="volunteer-label">Proof Photo</label>
                <input
                  className="volunteer-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(event) => setPhotoFile(event.target.files[0] || null)}
                />
                <p className="volunteer-helper">Accepted: JPG, JPEG, PNG. The current API records file metadata only.</p>
                {photoFile && <p className="volunteer-form-success">File selected: {photoFile.name}</p>}
              </div>
            </div>

            <div className="volunteer-alert is-muted">
              <ReportIcon>!</ReportIcon>
              <span>Submit only after confirming the field outcome. Safety or quality issues will hold the case for admin review.</span>
            </div>

            <div>
              <label className="volunteer-label">Verification Summary</label>
              <textarea
                className="volunteer-textarea"
                placeholder="Summarize the final verification decision for admin review."
                rows="4"
                {...register('verificationStatus', {
                  required: 'Verification summary is required',
                  minLength: {
                    value: 10,
                    message: 'Summary must be at least 10 characters',
                  },
                })}
              />
              {errors.verificationStatus && <p className="volunteer-error">{errors.verificationStatus.message}</p>}
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
