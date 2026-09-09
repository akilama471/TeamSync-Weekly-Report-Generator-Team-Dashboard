'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { api } from '@/lib/api';
import { Project } from '@/types';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setName('');
    setCode('');
    setDescription('');
    setColor('#3b82f6');
    setIsActive(true);
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setName(proj.name);
    setCode(proj.code || '');
    setDescription(proj.description || '');
    setColor(proj.color || '#3b82f6');
    setIsActive(proj.isActive);
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, {
          name,
          code,
          description,
          color,
          isActive,
        });
      } else {
        await api.createProject({
          name,
          code,
          description,
          color,
          isActive,
        });
      }
      setShowModal(false);
      await fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete or deactivate this project?')) return;
    try {
      await api.deleteProject(id);
      await fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to remove project');
    }
  };

  return (
    <AppShell
      title="Project &amp; Work Category Management"
      subtitle="Configure initiatives, work tags, and report categories for your engineering team"
      requireManager={true}
    >
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/90 border border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Active Projects &amp; Categories</h3>
            <p className="text-xs text-slate-400">Used for tagging weekly reports and tracking workload.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project / Category</span>
          </button>
        </div>

        {/* Projects Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/90 shadow-xl">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Project Name &amp; Color</th>
                <th className="p-4">Code</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4">Linked Reports</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-slate-400">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-slate-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: proj.color || '#3b82f6' }}
                        ></span>
                        <span className="font-bold text-white text-sm">{proj.name}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-indigo-300">{proj.code || '—'}</td>

                    <td className="p-4 text-slate-400 max-w-sm truncate">
                      {proj.description || 'No description provided.'}
                    </td>

                    <td className="p-4">
                      {proj.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-slate-300 font-semibold">
                      {proj._count?.reports || 0} reports
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete / Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingProject ? 'Edit Project Category' : 'Create New Project Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Client A - Banking Portal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Code Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CLT-A"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">{color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this project scope..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="activeCheck" className="text-xs text-slate-300 font-medium">
                  Active (available for report selection)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg transition"
                >
                  {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
