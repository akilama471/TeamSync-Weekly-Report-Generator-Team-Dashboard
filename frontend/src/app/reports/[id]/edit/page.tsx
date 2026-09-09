'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TaskTable } from '@/components/reports/task-table';
import { BlockerList } from '@/components/reports/blocker-list';
import { AchievementList } from '@/components/reports/achievement-list';
import { HoursBreakdown } from '@/components/reports/hours-breakdown';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { Report, Project, ReportTask, ReportNextTask, ReportBlocker, ReportAchievement, ReportHour, ReportLink } from '@/types';
import {
  AlertTriangle,
  FolderKanban,
  Calendar,
  Save,
  Send,
  Link as LinkIcon,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [report, setReport] = useState<Report | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<number>(0);
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState<ReportTask[]>([]);
  const [nextTasks, setNextTasks] = useState<ReportNextTask[]>([]);
  const [blockers, setBlockers] = useState<ReportBlocker[]>([]);
  const [achievements, setAchievements] = useState<ReportAchievement[]>([]);
  const [hours, setHours] = useState<ReportHour[]>([]);
  const [links, setLinks] = useState<ReportLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rep, projs] = await Promise.all([
          api.getReport(id),
          api.getProjects(),
        ]);
        setReport(rep);
        setProjects(projs);
        setProjectId(rep.projectId);
        setSummary(rep.summary || '');
        setNotes(rep.notes || '');
        setTasks(rep.tasks || []);
        setNextTasks(rep.nextTasks || []);
        setBlockers(rep.blockers || []);
        setAchievements(rep.achievements || []);
        setHours(rep.hours || []);
        setLinks(rep.links || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load report for editing');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

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
      setError('Please select a project');
      return;
    }

    if (tasks.length === 0 || !tasks.some((t) => t.taskName.trim())) {
      setError('Please add at least one valid task entry.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        projectId,
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

      await api.updateReport(id, payload);
      router.push(`/reports/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update report.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Loading Report...">
        <div className="py-24 text-center text-xs text-slate-400">Fetching report details...</div>
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

  const isNeedsCorrection = report.status === 'NEEDS_CORRECTION';

  return (
    <AppShell
      title={`Edit Weekly Report #${report.id}`}
      subtitle="Update report details, address reviewer comments, and resubmit"
    >
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* PROMINENT MANAGER CORRECTION NOTICE BANNER (Assignment Core Requirement) */}
        {isNeedsCorrection && (
          <div className="p-5 rounded-2xl bg-rose-950/40 border-2 border-rose-500/60 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
              <span>Manager Requested Corrections on this Report</span>
            </div>
            <p className="text-xs text-slate-300">
              The engineering manager sent this report back for revision with the following instructions:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-900/60 text-xs text-rose-200 font-medium italic leading-relaxed">
              &ldquo;{report.latestReviewComment || 'Please review and update missing details.'}&rdquo;
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-6 bg-surface/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          {/* Week info & Project selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reporting Week Range</span>
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {new Date(report.weekStart).toLocaleDateString()} &mdash; {new Date(report.weekEnd).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <StatusBadge status={report.status} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                <span>Project / Category</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="pb-6 border-b border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Weekly Narrative / Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tasks Table */}
          <div className="pb-6 border-b border-slate-800">
            <TaskTable tasks={tasks} onChange={setTasks} />
          </div>

          {/* Next Week Tasks */}
          <div className="pb-6 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Tasks Planned for Next Week</span>
              </h3>
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
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={nt.plannedHours}
                    onChange={(e) => updateNextTask(idx, 'plannedHours', parseFloat(e.target.value) || 0)}
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

          {/* Blockers */}
          <div className="pb-6 border-b border-slate-800">
            <BlockerList blockers={blockers} onChange={setBlockers} />
          </div>

          {/* Achievements */}
          <div className="pb-6 border-b border-slate-800">
            <AchievementList achievements={achievements} onChange={setAchievements} />
          </div>

          {/* Hours Breakdown */}
          <div className="pb-6 border-b border-slate-800">
            <HoursBreakdown hours={hours} onChange={setHours} />
          </div>

          {/* Notes & Links */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deliverable Links</span>
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
                    placeholder="Title"
                    className="w-1/3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(idx, 'url', e.target.value)}
                    placeholder="URL"
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

          {/* Actions */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span>Save Progress</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              <Send className="w-4 h-4" />
              <span>{isNeedsCorrection ? 'Resubmit Corrected Report' : 'Submit for Review'}</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
