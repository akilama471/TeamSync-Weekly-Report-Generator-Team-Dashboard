'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { Report, Project } from '@/types';
import {
  History,
  FileEdit,
  Eye,
  Calendar,
  AlertTriangle,
  Plus,
  Filter,
} from 'lucide-react';

export default function ReportHistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [repsRes, projsRes] = await Promise.all([
        api.getReports({
          projectId: selectedProject || undefined,
          status: selectedStatus || undefined,
        }),
        api.getProjects(),
      ]);
      setReports(repsRes.data);
      setProjects(projsRes);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedProject, selectedStatus]);

  return (
    <AppShell
      title="My Report History"
      subtitle="View all your past weekly submissions, reviewer feedback, and revision cycles"
    >
      <div className="space-y-6">
        {/* Header Bar with Filters & Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface/90 border border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filters:</span>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="NEEDS_CORRECTION">Needs Correction</option>
              <option value="APPROVED">Approved</option>
            </select>

            {/* Project Filter */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/reports/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition self-end sm:self-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Report</span>
          </Link>
        </div>

        {/* Reports History List Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/90 shadow-xl">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Week Range</th>
                <th className="p-4">Project</th>
                <th className="p-4">Tasks / Hours</th>
                <th className="p-4">Status</th>
                <th className="p-4">Manager Review Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-slate-400">
                    Loading your report history...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-slate-500">
                    No reports match your filters. Click &quot;Create New Report&quot; to begin!
                  </td>
                </tr>
              ) : (
                reports.map((rep) => {
                  const canEdit = rep.status === 'DRAFT' || rep.status === 'NEEDS_CORRECTION';
                  return (
                    <tr key={rep.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          <span>
                            {new Date(rep.weekStart).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            &mdash;{' '}
                            {new Date(rep.weekEnd).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-medium text-slate-300">{rep.project?.name}</span>
                      </td>

                      <td className="p-4 text-slate-400">
                        <span>{rep._count?.tasks || 0} tasks logged</span>
                      </td>

                      <td className="p-4">
                        <StatusBadge status={rep.status} />
                      </td>

                      <td className="p-4 max-w-xs">
                        {rep.latestReviewComment ? (
                          <div className="flex items-start gap-1.5 text-xs text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40 line-clamp-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                            <span>{rep.latestReviewComment}</span>
                          </div>
                        ) : rep.status === 'APPROVED' ? (
                          <span className="text-emerald-400 text-xs">✓ Approved by Manager</span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/reports/${rep.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>View</span>
                          </Link>

                          {canEdit && (
                            <Link
                              href={`/reports/${rep.id}/edit`}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                rep.status === 'NEEDS_CORRECTION'
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm animate-pulse'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                              }`}
                            >
                              <FileEdit className="w-3.5 h-3.5" />
                              <span>{rep.status === 'NEEDS_CORRECTION' ? 'Fix Report' : 'Edit'}</span>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
