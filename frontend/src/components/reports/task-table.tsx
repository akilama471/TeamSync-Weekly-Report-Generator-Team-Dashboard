'use client';

import React from 'react';
import { ReportTask, TaskPriority, TaskStatus } from '../../types';
import { Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface TaskTableProps {
  tasks: ReportTask[];
  onChange: (tasks: ReportTask[]) => void;
  readOnly?: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onChange, readOnly = false }) => {
  const addTask = () => {
    onChange([
      ...tasks,
      {
        taskName: '',
        priority: 'MEDIUM',
        plannedPercent: 100,
        actualPercent: 0,
        status: 'IN_PROGRESS',
        plannedHours: 8,
        spentHours: 0,
        deliverable: '',
      },
    ]);
  };

  const updateTask = (index: number, field: keyof ReportTask, value: any) => {
    const updated = [...tasks];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    // Auto-update status if actual is 100%
    if (field === 'actualPercent' && Number(value) >= 100) {
      updated[index].status = 'COMPLETED';
    }

    onChange(updated);
  };

  const removeTask = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Completed &amp; Ongoing Tasks</span>
          </h3>
          <p className="text-xs text-slate-400">
            Task-level table tracking progress percentages, hours, deliverables, and priorities.
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={addTask}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-surface/90">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3">Task Name</th>
              <th className="p-3 w-28">Priority</th>
              <th className="p-3 w-24 text-right">Planned %</th>
              <th className="p-3 w-24 text-right">Actual %</th>
              <th className="p-3 w-32">Status</th>
              <th className="p-3 w-24 text-right">Est. Time</th>
              <th className="p-3 w-24 text-right">Spent</th>
              <th className="p-3 min-w-[140px]">Deliverable Output</th>
              {!readOnly && <th className="p-3 w-12 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 8 : 9} className="p-6 text-center text-slate-500">
                  No tasks added yet. Click &quot;Add Task&quot; above to log your weekly work.
                </td>
              </tr>
            ) : (
              tasks.map((task, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  {/* Task Name */}
                  <td className="p-2.5">
                    {readOnly ? (
                      <span className="font-medium text-white">{task.taskName}</span>
                    ) : (
                      <input
                        type="text"
                        value={task.taskName}
                        onChange={(e) => updateTask(idx, 'taskName', e.target.value)}
                        placeholder="e.g. Implement Login Auth API"
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    )}
                  </td>

                  {/* Priority */}
                  <td className="p-2.5">
                    {readOnly ? (
                      <span className="capitalize">{task.priority}</span>
                    ) : (
                      <select
                        value={task.priority}
                        onChange={(e) => updateTask(idx, 'priority', e.target.value as TaskPriority)}
                        className="w-full px-2 py-1.5 rounded bg-slate-950/60 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    )}
                  </td>

                  {/* Planned % */}
                  <td className="p-2.5 text-right">
                    {readOnly ? (
                      `${task.plannedPercent}%`
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={task.plannedPercent}
                        onChange={(e) => updateTask(idx, 'plannedPercent', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 text-right rounded bg-slate-950/60 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </td>

                  {/* Actual % */}
                  <td className="p-2.5 text-right">
                    {readOnly ? (
                      <span className={task.actualPercent >= 100 ? 'text-emerald-400 font-semibold' : ''}>
                        {task.actualPercent}%
                      </span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={task.actualPercent}
                        onChange={(e) => updateTask(idx, 'actualPercent', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 text-right rounded bg-slate-950/60 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-2.5">
                    {readOnly ? (
                      <span>{task.status}</span>
                    ) : (
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(idx, 'status', e.target.value as TaskStatus)}
                        className="w-full px-2 py-1.5 rounded bg-slate-950/60 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      >
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="BLOCKED">Blocked</option>
                      </select>
                    )}
                  </td>

                  {/* Est Time */}
                  <td className="p-2.5 text-right">
                    {readOnly ? (
                      `${task.plannedHours}h`
                    ) : (
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={task.plannedHours}
                        onChange={(e) => updateTask(idx, 'plannedHours', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 text-right rounded bg-slate-950/60 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </td>

                  {/* Spent Time */}
                  <td className="p-2.5 text-right">
                    {readOnly ? (
                      `${task.spentHours}h`
                    ) : (
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={task.spentHours}
                        onChange={(e) => updateTask(idx, 'spentHours', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 text-right rounded bg-slate-950/60 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </td>

                  {/* Deliverable */}
                  <td className="p-2.5">
                    {readOnly ? (
                      <span className="text-slate-300">{task.deliverable || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={task.deliverable || ''}
                        onChange={(e) => updateTask(idx, 'deliverable', e.target.value)}
                        placeholder="e.g. PR #104 merged, Figma link"
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </td>

                  {/* Delete button */}
                  {!readOnly && (
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeTask(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
