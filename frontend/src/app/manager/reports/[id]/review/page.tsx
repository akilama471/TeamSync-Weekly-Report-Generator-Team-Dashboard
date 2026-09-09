'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { StatusBadge } from '@/components/ui/status-badge';
import { TaskTable } from '@/components/reports/task-table';
import { BlockerList } from '@/components/reports/blocker-list';
import { AchievementList } from '@/components/reports/achievement-list';
import { HoursBreakdown } from '@/components/reports/hours-breakdown';
import { api } from '@/lib/api';
import { Report, ReportVersion } from '@/types';
import {
  CheckCircle2,
  AlertTriangle,
  History,
  FolderKanban,
  Calendar,
  Layers,
  ArrowLeft,
  X,
  Send,
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerReviewPage() {
  const params = useParams();
  const id = Number(params?.id);
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [versions, setVersions] = useState<ReportVersion[]>([]);
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number | 'current'>('current');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal dialog states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const fetchReportAndVersions = async () => {
    try {
      const [rep, vers] = await Promise.all([
        api.getReport(id),
        api.getReportVersions(id),
      ]);
      setReport(rep);
      setVersions(vers);
    } catch (err: any) {
      setError(err.message || 'Failed to load report for review');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReportAndVersions();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.approveReport(id, reviewComment || 'Report approved by manager.');
      setShowApproveModal(false);
      await fetchReportAndVersions();
    } catch (err: any) {
      setError(err.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestCorrection = async () => {
    if (!reviewComment.trim()) {
      setError('Please enter a comment explaining what needs to be changed.');
      return;
    }
    setActionLoading(true);
    try {
      await api.requestCorrection(id, reviewComment);
      setShowCorrectionModal(false);
      await fetchReportAndVersions();
    } catch (err: any) {
      setError(err.message || 'Requesting correction failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Loading Review...">
        <div className="py-24 text-center text-xs text-slate-400">Loading report for review...</div>
      </AppShell>
    );
  }

  if (!report) {
    return (
      <AppShell title="Report Not Found">
        <div className="py-24 text-center text-xs text-rose-400">{error || 'Report not found'}</div>
      </AppShell>
    );
  }

  // If viewing a previous version snapshot
  const activeVersion =
    selectedVersionNumber === 'current'
      ? null
      : versions.find((v) => v.versionNumber === selectedVersionNumber);

  const displayTasks = activeVersion ? activeVersion.snapshotData?.tasks || [] : report.tasks;
  const displayBlockers = activeVersion ? activeVersion.snapshotData?.blockers || [] : report.blockers;
  const displayAchievements = activeVersion ? activeVersion.snapshotData?.achievements || [] : report.achievements;
  const displayHours = activeVersion ? activeVersion.snapshotData?.hours || [] : report.hours;

  return (
    <AppShell
      title={`Reviewing Report #${report.id} - ${report.user.name}`}
      subtitle="Examine submitted report, review past version snapshots, and approve or request revisions"
      requireManager={true}
    >
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface/90 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </Link>
              <StatusBadge status={report.status} />
            </div>
            <h2 className="text-xl font-extrabold text-white">{report.user.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {report.project.name} • Week of {new Date(report.weekStart).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons (Approve / Request Changes) */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {report.status === 'SUBMITTED' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setReviewComment('');
                    setShowCorrectionModal(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/50 transition flex items-center gap-1.5 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Request Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReviewComment('Looks great! Approved.');
                    setShowApproveModal(true);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Report</span>
                </button>
              </>
            ) : report.status === 'APPROVED' ? (
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Report Approved</span>
              </span>
            ) : (
              <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                Awaiting Member Edits ({report.status})
              </span>
            )}
          </div>
        </div>

        {/* Version History Comparison Selector (Bonus Requirement from Section 3 & 18) */}
        {versions.length > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <History className="w-4 h-4 text-indigo-400" />
                <span>Version Snapshots (Immutable Submissions History)</span>
              </div>
              <span className="text-[10px] text-indigo-300 uppercase font-semibold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                {versions.length} Version{versions.length > 1 ? 's' : ''} Archival
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select a version snapshot to inspect exact report contents submitted at each review cycle.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedVersionNumber('current')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedVersionNumber === 'current'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Current Active Version
              </button>

              {versions.map((ver) => (
                <button
                  key={ver.id}
                  type="button"
                  onClick={() => setSelectedVersionNumber(ver.versionNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    selectedVersionNumber === ver.versionNumber
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Version {ver.versionNumber}</span>
                  <span className="text-[10px] text-slate-400">
                    ({new Date(ver.submittedAt).toLocaleDateString()})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notice if viewing historical snapshot */}
        {activeVersion && (
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/50 text-xs text-purple-200 flex items-center justify-between">
            <span>Viewing historical snapshot for <strong>Version {activeVersion.versionNumber}</strong> submitted on {new Date(activeVersion.submittedAt).toLocaleString()}</span>
            <button
              onClick={() => setSelectedVersionNumber('current')}
              className="text-xs font-bold text-white underline"
            >
              Return to Current
            </button>
          </div>
        )}

        {/* Tasks Table */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <TaskTable tasks={displayTasks} onChange={() => {}} readOnly={true} />
        </div>

        {/* Blockers */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <BlockerList blockers={displayBlockers} onChange={() => {}} readOnly={true} />
        </div>

        {/* Achievements */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <AchievementList achievements={displayAchievements} onChange={() => {}} readOnly={true} />
        </div>

        {/* Hours Breakdown */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <HoursBreakdown hours={displayHours} onChange={() => {}} readOnly={true} />
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Approve Report #{report.id}</span>
              </h3>
              <button onClick={() => setShowApproveModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you satisfied with the deliverables and tasks reported by {report.user.name}? This moves the report status to <strong>APPROVED</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Approval Note (Optional)
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Great progress this week! Approved."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleApprove}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition"
              >
                {actionLoading ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Correction Modal (Required Section 16: Requires general comment) */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Request Corrections</span>
              </h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This moves the report status to <strong>NEEDS_CORRECTION</strong> and re-opens editing for {report.user.name}.
            </p>

            <div>
              <label className="block text-xs font-bold text-rose-300 mb-1.5">
                Required Feedback Comment *
              </label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="e.g. Please update the actual completion percentages and provide the deliverable link for the auth API."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-rose-500/60 text-xs text-white focus:outline-none focus:border-rose-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                This comment will be prominently displayed on the team member&apos;s edit page.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !reviewComment.trim()}
                onClick={handleRequestCorrection}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white shadow-lg transition"
              >
                {actionLoading ? 'Sending...' : 'Send Back for Correction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
