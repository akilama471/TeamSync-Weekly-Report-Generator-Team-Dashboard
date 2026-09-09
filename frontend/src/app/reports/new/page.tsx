'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TaskTable } from '@/components/reports/task-table';
import { BlockerList } from '@/components/reports/blocker-list';
import { AchievementList } from '@/components/reports/achievement-list';
import { HoursBreakdown } from '@/components/reports/hours-breakdown';
import { api } from '@/lib/api';
import { Project, ReportTask, ReportNextTask, ReportBlocker, ReportAchievement, ReportHour, ReportLink } from '@/types';
import {
  Calendar,
  FolderKanban,
  FileText,
  Link as LinkIcon,
  Plus,
  Trash2,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { startOfWeek, endOfWeek, format, subWeeks } from 'date-fns';

export default function NewReportPage() {
  const router = useRouter();

  // Current week defaults (Monday - Sunday)
  const defaultStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const defaultEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<number | ''>('');
  const [weekStart, setWeekStart] = useState(format(defaultStart, 'yyyy-MM-dd'));
  const [weekEnd, setWeekEnd] = useState(format(defaultEnd, 'yyyy-MM-dd'));
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');

  // Fixed structured sections
  const [tasks, setTasks] = useState<ReportTask[]>([
    {
      taskName: '',
      priority: 'HIGH',
      plannedPercent: 100,
      actualPercent: 100,
      status: 'COMPLETED',
      plannedHours: 8,
      spentHours: 8,
      deliverable: '',
    },
  ]);

  const [nextTasks, setNextTasks] = useState<ReportNextTask[]>([
    { title: '', priority: 'MEDIUM', plannedHours: 6 },
  ]);

  const [blockers, setBlockers] = useState<ReportBlocker[]>([]);
  const [achievements, setAchievements] = useState<ReportAchievement[]>([]);
  const [hours, setHours] = useState<ReportHour[]>([
    { taskType: 'Development', hours: 24 },
    { taskType: 'Testing & QA', hours: 6 },
    { taskType: 'Team Meetings & Syncs', hours: 4 },
  ]);
  const [links, setLinks] = useState<ReportLink[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projs = await api.getProjects();
        setProjects(projs);
        if (projs.length > 0) {
          setProjectId(projs[0].id);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    fetchProjects();
  }, []);

  // Sync weekEnd when weekStart changes (7 days period)
  const handleWeekStartChange = (val: string) => {
    setWeekStart(val);
    const d = new Date(val);
    const end = endOfWeek(d, { weekStartsOn: 1 });
    setWeekEnd(format(end, 'yyyy-MM-dd'));
  };

  const addNextTask = () => {
    setNextTasks([...nextTasks, { title: '', priority: 'MEDIUM', plannedHours: 4 }]);
  };

  const updateNextTask = (idx: number, field: string, val: any) => {
    const updated = [...nextTasks];
    updated[idx] = { ...updated[idx], [field]: val };
    setNextTasks(updated);
  };

  const removeNextTask = (idx: number) => {
    setNextTasks(nextTasks.filter((_, i) => i !== idx));
  };

  const addLink = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

  const updateLink = (idx: number, field: 'title' | 'url', val: string) => {
    const updated = [...links];
    updated[idx] = { ...updated[idx], [field]: val };
    setLinks(updated);
  };

  const removeLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const handleSave = async (submitImmediately: boolean) => {
    setError(null);
    if (!projectId) {
      setError('Please select an active project category.');
      return;
    }

    if (tasks.length === 0 || !tasks.some((t) => t.taskName.trim())) {
      setError('Please add at least one task entry before saving or submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        projectId: Number(projectId),
        weekStart,
        weekEnd,
        summary,
        notes,
        links: links.filter((l) => l.url.trim()),
        tasks: tasks.filter((t) => t.taskName.trim()),
        nextTasks: nextTasks.filter((nt) => nt.title.trim()),
        blockers: blockers.filter((b) => b.description.trim()),
        achievements: achievements.filter((a) => a.description.trim()),
        hours: hours.filter((h) => Number(h.hours) > 0),
        submitImmediately,
      };

      const res = await api.createReport(payload);
      if (submitImmediately) {
        router.push(`/reports/${res.id}`);
      } else {
        router.push('/reports/history');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Create Weekly Report"
      subtitle="Standardized reporting template for sprint achievements, tasks, and roadblocks"
    >
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Banner: Fixed Structure Notice */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-200">
          <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Fixed &amp; Standardized Report Structure</p>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              Every team member follows the identical fixed sequence of fields to ensure consistent,
              objective comparison across the team dashboard.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6 bg-surface/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          {/* Section 1: Week Range & Project Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Week Starting (Monday)</span>
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => handleWeekStartChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Ends on: {weekEnd}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                <span>Project / Category Tag</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} ({proj.code || 'PRJ'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Executive Summary */}
          <div className="pb-6 border-b border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              High-Level Weekly Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief executive narrative of your main focus this week..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Section 3: Tasks Completed Table (Required Section 8) */}
          <div className="pb-6 border-b border-slate-800">
            <TaskTable tasks={tasks} onChange={setTasks} />
          </div>

          {/* Section 4: Tasks Planned for Next Week (Required Section 9) */}
          <div className="pb-6 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Tasks Planned for Next Week</span>
                </h3>
                <p className="text-xs text-slate-400">Describe upcoming deliverables for next sprint.</p>
              </div>
              <button
                type="button"
                onClick={addNextTask}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Planned Task</span>
              </button>
            </div>

            <div className="space-y-2">
              {nextTasks.map((nt, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <input
                    type="text"
                    value={nt.title}
                    onChange={(e) => updateNextTask(idx, 'title', e.target.value)}
                    placeholder={`Upcoming task #${idx + 1}...`}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={nt.plannedHours}
                    onChange={(e) => updateNextTask(idx, 'plannedHours', parseFloat(e.target.value) || 0)}
                    placeholder="Hrs"
                    className="w-20 px-2 py-2 text-right rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    title="Planned hours"
                  />
                  <button
                    type="button"
                    onClick={() => removeNextTask(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Blockers & Challenges (Required Section 10) */}
          <div className="pb-6 border-b border-slate-800">
            <BlockerList blockers={blockers} onChange={setBlockers} />
          </div>

          {/* Section 6: Achievements & Highlights (Required Section 11) */}
          <div className="pb-6 border-b border-slate-800">
            <AchievementList achievements={achievements} onChange={setAchievements} />
          </div>

          {/* Section 7: Hours Worked Breakdown (Section 12) */}
          <div className="pb-6 border-b border-slate-800">
            <HoursBreakdown hours={hours} onChange={setHours} />
          </div>

          {/* Section 8: Notes & Links (Section 13) */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Notes or Context
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special remarks, PTO announcements, or context..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            {/* Links / Deliverables */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deliverable Links (PRs, Figma, Docs)</span>
                </span>
                <button
                  type="button"
                  onClick={addLink}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  + Add Link
                </button>
              </div>

              {links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(idx, 'title', e.target.value)}
                    placeholder="Title (e.g. GitHub PR #104)"
                    className="w-1/3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar (Save Draft vs Submit for Review) */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(true)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Manager Review</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
