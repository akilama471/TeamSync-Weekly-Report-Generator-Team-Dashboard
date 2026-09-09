import React from 'react';
import Link from 'next/link';
import { ActivityItem } from '../../types';
import { CheckCircle2, RotateCcw, MessageSquare } from 'lucide-react';

export const RecentActivity: React.FC<{ items: ActivityItem[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500">
        No recent review activities recorded.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const isApproved = item.action === 'APPROVED';
        return (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-surface/80 border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition"
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                isApproved
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                  : 'bg-rose-950/70 text-rose-400 border border-rose-800/40'
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white">
                  {isApproved ? 'Report Approved' : 'Changes Requested'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-slate-300 mt-0.5">
                <span className="font-medium text-slate-200">{item.reviewerName}</span> reviewed{' '}
                <span className="font-medium text-indigo-400">{item.memberName}&apos;s</span> report (
                {item.projectName})
              </p>

              {item.comment && (
                <p className="mt-1 text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 italic text-[11px] line-clamp-2">
                  &ldquo;{item.comment}&rdquo;
                </p>
              )}

              <div className="mt-1.5">
                <Link
                  href={`/reports/${item.reportId}`}
                  className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition"
                >
                  View Report &rarr;
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
