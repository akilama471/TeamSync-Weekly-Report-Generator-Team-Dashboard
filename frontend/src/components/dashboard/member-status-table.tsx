'use client';

import React from 'react';
import Link from 'next/link';
import { MemberStatusItem } from '../../types';
import { StatusBadge } from '../ui/status-badge';
import { ExternalLink, User as UserIcon } from 'lucide-react';

export const MemberStatusTable: React.FC<{ items: MemberStatusItem[] }> = ({ items }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-surface/90">
      <table className="w-full text-left text-xs text-slate-200">
        <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
          <tr>
            <th className="p-3.5">Team Member</th>
            <th className="p-3.5">Project / Category</th>
            <th className="p-3.5">Submission Status</th>
            <th className="p-3.5">Submitted Date</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {items.map((item) => (
            <tr key={item.member.id} className="hover:bg-slate-800/30 transition">
              {/* Member Info with link to Profile page */}
              <td className="p-3.5">
                <Link
                  href={`/manager/users/${item.member.id}`}
                  className="flex items-center gap-2.5 group"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-300">
                    {item.member.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.member.avatarUrl} alt={item.member.name} className="w-full h-full object-cover" />
                    ) : (
                      item.member.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-white group-hover:text-indigo-400 transition">
                      {item.member.name}
                    </span>
                    <p className="text-[11px] text-slate-400">{item.member.department || 'Engineering'}</p>
                  </div>
                </Link>
              </td>

              {/* Project */}
              <td className="p-3.5 text-slate-300">
                {item.projectName !== 'N/A' ? (
                  <span className="font-medium text-slate-200">{item.projectName}</span>
                ) : (
                  <span className="text-slate-500 italic">No report filed</span>
                )}
              </td>

              {/* Status */}
              <td className="p-3.5">
                <StatusBadge status={item.status} />
              </td>

              {/* Submitted At */}
              <td className="p-3.5 text-slate-400">
                {item.submittedAt
                  ? new Date(item.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </td>

              {/* Action Buttons */}
              <td className="p-3.5 text-right">
                {item.reportId ? (
                  <div className="flex items-center justify-end gap-2">
                    {item.status === 'SUBMITTED' ? (
                      <Link
                        href={`/manager/reports/${item.reportId}/review`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                      >
                        Review
                      </Link>
                    ) : (
                      <Link
                        href={`/reports/${item.reportId}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
