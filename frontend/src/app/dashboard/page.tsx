'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { MetricCard } from '@/components/dashboard/metric-card';
import { TaskTrendChart } from '@/components/dashboard/task-trend-chart';
import { WorkloadChart } from '@/components/dashboard/workload-chart';
import { TimeChart } from '@/components/dashboard/time-chart';
import { MemberStatusTable } from '@/components/dashboard/member-status-table';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { SideBySideModal } from '@/components/dashboard/side-by-side-modal';
import { api } from '@/lib/api';
import {
  DashboardSummary,
  TaskTrend,
  MemberStatusItem,
  WorkloadItem,
  TimeDistributionItem,
  ActivityItem,
} from '@/types';
import {
  FileCheck2,
  Percent,
  AlertTriangle,
  Flame,
  Calendar,
  Layers,
  Columns,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { startOfWeek, subWeeks, format } from 'date-fns';

export default function DashboardPage() {
  // Generate past 4 weeks options
  const now = new Date();
  const weekOptions = [0, 1, 2, 3].map((offset) => {
    const d = subWeeks(now, offset);
    const start = startOfWeek(d, { weekStartsOn: 1 });
    return {
      label: `Week of ${format(start, 'MMM dd, yyyy')}${offset === 0 ? ' (Current)' : ''}`,
      value: format(start, 'yyyy-MM-dd'),
    };
  });

  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0].value);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<TaskTrend[]>([]);
  const [memberStatus, setMemberStatus] = useState<MemberStatusItem[]>([]);
  const [workload, setWorkload] = useState<WorkloadItem[]>([]);
  const [timeDist, setTimeDist] = useState<TimeDistributionItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSideBySideOpen, setIsSideBySideOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, trendsRes, statusRes, workRes, timeRes, actRes] = await Promise.all([
        api.getDashboardSummary(selectedWeek),
        api.getTaskTrends(),
        api.getMemberStatus(selectedWeek),
        api.getWorkload(selectedWeek),
        api.getTimeDistribution(selectedWeek),
        api.getRecentActivity(),
      ]);

      setSummary(sumRes);
      setTrends(trendsRes);
      setMemberStatus(statusRes);
      setWorkload(workRes);
      setTimeDist(timeRes);
      setActivity(actRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedWeek]);

  return (
    <AppShell
      title="Team Executive Dashboard"
      subtitle="Overview of weekly team submissions, sprint health, and delivery metrics"
      requireManager={true}
    >
      <div className="space-y-6">
        {/* Top Control Bar: Week Selector & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface/90 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Reporting Period
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="mt-0.5 bg-slate-950 border border-slate-700 text-sm font-semibold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition"
              >
                {weekOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {/* Side-by-side Bonus Feature Trigger */}
            <button
              onClick={() => setIsSideBySideOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition shadow-sm"
            >
              <Columns className="w-3.5 h-3.5 text-indigo-400" />
              <span>Side-by-Side View</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded">
                Bonus
              </span>
            </button>

            <button
              onClick={fetchDashboardData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. Summary Metrics Cards (Section 6 & 21) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Submitted"
            value={summary ? `${summary.submittedCount} / ${summary.totalTeamMembers}` : '—'}
            subtitle="Reports submitted for this week"
            icon={FileCheck2}
            colorScheme="indigo"
          />

          <MetricCard
            title="Compliance Rate"
            value={summary ? `${summary.complianceRate}%` : '—'}
            subtitle="Team on-time submission rate"
            icon={Percent}
            colorScheme="emerald"
          />

          <MetricCard
            title="Needs Correction"
            value={summary ? summary.needsCorrectionCount : '—'}
            subtitle="Returned for member revisions"
            icon={AlertTriangle}
            colorScheme="rose"
          />

          <MetricCard
            title="Open Blockers"
            value={summary ? summary.openBlockersCount : '—'}
            subtitle="Critical hurdles logged by team"
            icon={Flame}
            colorScheme="amber"
          />
        </div>

        {/* 2. Visual Insights Charts Grid (Section 22) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Completion Velocity Trend */}
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800 flex flex-col justify-between">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Task Completion Velocity</span>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  Past 5 Weeks
                </span>
              </h3>
              <p className="text-xs text-slate-400">Total completed deliverables over time</p>
            </div>
            <TaskTrendChart data={trends} />
          </div>

          {/* Workload by Project */}
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800 flex flex-col justify-between">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white">Workload Distribution by Project</h3>
              <p className="text-xs text-slate-400">Cumulative hours logged across team projects</p>
            </div>
            <WorkloadChart data={workload} />
          </div>
        </div>

        {/* 3. Team Member Submission Tracking Table (Section 20) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Team Member Submission Status</h3>
              <p className="text-xs text-slate-400">
                Track who has submitted, draft in progress, or pending corrections
              </p>
            </div>
          </div>
          <MemberStatusTable items={memberStatus} />
        </div>

        {/* 4. Bottom Grid: Time Allocation & Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Distribution by Task Type */}
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white">Team Time by Task Category</h3>
              <p className="text-xs text-slate-400">
                Logged hours breakdown: Development vs Meetings vs Testing
              </p>
            </div>
            <TimeChart data={timeDist} />
          </div>

          {/* Recent Activity Audit Feed */}
          <div className="p-5 rounded-2xl bg-surface/90 border border-slate-800">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white">Recent Review &amp; Approval Activity</h3>
              <p className="text-xs text-slate-400">
                Chronological log of manager reviews, corrections, and submissions
              </p>
            </div>
            <RecentActivity items={activity} />
          </div>
        </div>
      </div>

      {/* Side-by-Side View Modal (Bonus Deliverable) */}
      <SideBySideModal
        isOpen={isSideBySideOpen}
        onClose={() => setIsSideBySideOpen(false)}
        weekStart={selectedWeek}
      />
    </AppShell>
  );
}
