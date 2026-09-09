'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { StatusBadge } from '@/components/ui/status-badge';
import { TaskTable } from '@/components/reports/task-table';
import { BlockerList } from '@/components/reports/blocker-list';
import { AchievementList } from '@/components/reports/achievement-list';
import { HoursBreakdown } from '@/components/reports/hours-breakdown';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Report } from '@/types';
import {
  Calendar,
  FolderKanban,
  FileText,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  History,
  FileEdit,
  ExternalLink,
  Printer,
} from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { user, isManager } = useAuth();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const rep = await api.getReport(id);
        setReport(rep);
      } catch (err: any) {
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id]);

  if (loading) {
    return (
      <AppShell title="Loading Report...">
        <div className="py-24 text-center text-xs text-slate-400">Loading report data...</div>
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

  const isOwner = user?.id === report.userId;
  const canEdit = isOwner && (report.status === 'DRAFT' || report.status === 'NEEDS_CORRECTION');

  return (
    <AppShell
      title={`Weekly Report #${report.id}`}
      subtitle={`${report.user.name} • ${report.project.name}`}
    >
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Top Header Card */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center font-bold text-lg text-white">
              {report.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={report.user.avatarUrl} alt={report.user.name} className="w-full h-full object-cover" />
              ) : (
                report.user.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">{report.user.name}</h2>
              <p className="text-xs text-slate-400">
                {report.user.department || 'Engineering'} • {report.user.jobTitle || 'Engineer'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-slate-900 border border-slate-700 text-slate-300">
                  <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                  {report.project.name}
                </span>
                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center">
            {canEdit && (
              <Link
                href={`/reports/${report.id}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit / Resubmit</span>
              </Link>
            )}

            {isManager && report.status === 'SUBMITTED' && (
              <Link
                href={`/manager/reports/${report.id}/review`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition"
              >
                <span>Review Report</span>
              </Link>
            )}

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Manager Feedback Banner if in NEEDS_CORRECTION */}
        {report.status === 'NEEDS_CORRECTION' && report.latestReviewComment && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500/60 shadow-xl space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Manager Requested Changes</span>
            </div>
            <p className="text-xs text-rose-200 italic">&ldquo;{report.latestReviewComment}&rdquo;</p>
          </div>
        )}

        {/* Weekly Narrative / Summary */}
        {report.summary && (
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Weekly Narrative
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {report.summary}
            </p>
          </div>
        )}

        {/* Tasks Table (Read Only) */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <TaskTable tasks={report.tasks} onChange={() => {}} readOnly={true} />
        </div>

        {/* Planned Next Week Tasks */}
        {report.nextTasks && report.nextTasks.length > 0 && (
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Tasks Planned for Next Week</span>
            </h3>
            <div className="space-y-2">
              {report.nextTasks.map((nt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-200">{nt.title}</span>
                  {nt.plannedHours && (
                    <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Est. {nt.plannedHours}h
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blockers & Challenges */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <BlockerList blockers={report.blockers} onChange={() => {}} readOnly={true} />
        </div>

        {/* Achievements */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <AchievementList achievements={report.achievements} onChange={() => {}} readOnly={true} />
        </div>

        {/* Hours Breakdown */}
        <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
          <HoursBreakdown hours={report.hours} onChange={() => {}} readOnly={true} />
        </div>

        {/* Notes & Deliverable Links */}
        {(report.notes || (report.links && report.links.length > 0)) && (
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notes &amp; Deliverables
            </h3>
            {report.notes && (
              <p className="text-xs text-slate-300 leading-relaxed">{report.notes}</p>
            )}
            {report.links && report.links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {report.links.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-700 transition"
                  >
                    <span>{l.title || l.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Version History & Review Comments Audit (Bonus Feature) */}
        {report.reviewComments && report.reviewComments.length > 0 && (
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Review Audit Trail &amp; Manager Comments</span>
            </h3>
            <div className="space-y-2.5">
              {report.reviewComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-2">
                    <span className="font-semibold text-white">{comment.reviewer.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {comment.action}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">&ldquo;{comment.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
