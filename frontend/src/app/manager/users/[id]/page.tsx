'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { StatusBadge } from '@/components/ui/status-badge';
import { MetricCard } from '@/components/dashboard/metric-card';
import { api } from '@/lib/api';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  FileCheck2,
  Percent,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const id = Number(params?.id);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getUser(id);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load member profile');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <AppShell title="Loading Member Profile...">
        <div className="py-24 text-center text-xs text-slate-400">Loading member statistics...</div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell title="Member Not Found">
        <div className="py-24 text-center text-xs text-rose-400">{error || 'User not found'}</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Team Member: ${profile.name}`}
      subtitle="Comprehensive member profile, submission compliance records, and historical reports"
      requireManager={true}
    >
      <div className="max-w-5xl mx-auto space-y-6 pb-16">
        {/* Top Profile Card */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 overflow-hidden flex items-center justify-center font-bold text-2xl text-white shadow-lg">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.name.charAt(0)
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {profile.role.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  {profile.jobTitle || 'Engineer'} ({profile.department || 'Engineering'})
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {profile.email}
                </span>
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Member Performance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Reports"
            value={profile.stats.totalReports}
            subtitle="Lifetime weekly reports"
            icon={FileCheck2}
            colorScheme="indigo"
          />

          <MetricCard
            title="Approved Rate"
            value={`${profile.stats.complianceRate}%`}
            subtitle="Submission compliance score"
            icon={Percent}
            colorScheme="emerald"
          />

          <MetricCard
            title="Needs Correction"
            value={profile.stats.needsCorrectionCount}
            subtitle="Revisions requested"
            icon={AlertTriangle}
            colorScheme="rose"
          />

          <MetricCard
            title="Approved Total"
            value={profile.stats.approvedCount}
            subtitle="Successfully verified"
            icon={FileCheck2}
            colorScheme="cyan"
          />
        </div>

        {/* Full Report History for this Member */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Full Weekly Report History</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Week Period</th>
                  <th className="p-3.5">Project</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tasks</th>
                  <th className="p-3.5">Submitted On</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {profile.reports.map((rep: any) => (
                  <tr key={rep.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>
                          {new Date(rep.weekStart).toLocaleDateString()} &mdash; {new Date(rep.weekEnd).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">{rep.project.name}</td>

                    <td className="p-3.5">
                      <StatusBadge status={rep.status} />
                    </td>

                    <td className="p-3.5 text-slate-400">{rep._count?.tasks || 0} tasks</td>

                    <td className="p-3.5 text-slate-400">
                      {rep.submittedAt ? new Date(rep.submittedAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="p-3.5 text-right">
                      <Link
                        href={`/reports/${rep.id}`}
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
