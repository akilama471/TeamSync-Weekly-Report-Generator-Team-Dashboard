import React from 'react';
import { ReportStatus, TaskPriority, TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: ReportStatus | TaskStatus | TaskPriority | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (status) {
    // Report Statuses
    case 'APPROVED':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
          Approved
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-950/80 text-blue-400 border border-blue-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5 animate-pulse"></span>
          Submitted
        </span>
      );
    case 'NEEDS_CORRECTION':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>
          Needs Correction
        </span>
      );
    case 'DRAFT':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
          Draft
        </span>
      );
    case 'NOT_STARTED':
      return (
        <span className={`inline-flex items-center rounded-full bg-gray-900 text-gray-400 border border-gray-700 ${sizeClasses}`}>
          Not Yet Started
        </span>
      );

    // Task Priorities
    case 'URGENT':
      return (
        <span className={`inline-flex items-center rounded bg-red-950 text-red-400 border border-red-800/40 ${sizeClasses}`}>
          Urgent
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center rounded bg-amber-950/80 text-amber-400 border border-amber-800/40 ${sizeClasses}`}>
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 ${sizeClasses}`}>
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center rounded bg-slate-800 text-slate-400 border border-slate-700 ${sizeClasses}`}>
          Low
        </span>
      );

    // Task Statuses
    case 'COMPLETED':
      return (
        <span className={`inline-flex items-center rounded bg-emerald-950/60 text-emerald-400 border border-emerald-700/40 ${sizeClasses}`}>
          ✓ Completed
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center rounded bg-cyan-950/60 text-cyan-400 border border-cyan-700/40 ${sizeClasses}`}>
          In Progress
        </span>
      );
    case 'BLOCKED':
      return (
        <span className={`inline-flex items-center rounded bg-rose-950/80 text-rose-400 border border-rose-800/40 ${sizeClasses}`}>
          ⛔ Blocked
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-800 text-slate-300 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
