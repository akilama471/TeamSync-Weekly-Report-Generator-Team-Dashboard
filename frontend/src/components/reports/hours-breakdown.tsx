'use client';

import React from 'react';
import { ReportHour } from '../../types';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface HoursBreakdownProps {
  hours: ReportHour[];
  onChange: (hours: ReportHour[]) => void;
  readOnly?: boolean;
}

const DEFAULT_CATEGORIES = [
  'Development',
  'Testing & QA',
  'Code Review',
  'Team Meetings & Syncs',
  'Documentation & Planning',
];

export const HoursBreakdown: React.FC<HoursBreakdownProps> = ({
  hours,
  onChange,
  readOnly = false,
}) => {
  const addCategory = (type: string) => {
    if (hours.some((h) => h.taskType === type)) return;
    onChange([...hours, { taskType: type, hours: 0 }]);
  };

  const updateHours = (index: number, val: number) => {
    const updated = [...hours];
    updated[index].hours = Math.max(0, val);
    onChange(updated);
  };

  const removeCategory = (index: number) => {
    onChange(hours.filter((_, i) => i !== index));
  };

  const totalHours = hours.reduce((acc, h) => acc + (Number(h.hours) || 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Hours Worked by Task Type</span>
          </h3>
          <p className="text-xs text-slate-400">
            Categorized breakdown of weekly time allocation (e.g. Development, Meetings, Testing).
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total Hours: </span>
          <span className="text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {totalHours.toFixed(1)}h
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {hours.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-surface/90 border border-slate-800 flex items-center justify-between gap-2"
          >
            <span className="text-xs font-medium text-slate-300 truncate">{item.taskType}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {readOnly ? (
                <span className="text-xs font-semibold text-white bg-slate-900 px-2 py-1 rounded">
                  {item.hours}h
                </span>
              ) : (
                <>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={item.hours}
                    onChange={(e) => updateHours(idx, parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-right rounded bg-slate-950/70 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeCategory(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-500">Quick add category:</span>
          {DEFAULT_CATEGORIES.filter((cat) => !hours.some((h) => h.taskType === cat)).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => addCategory(cat)}
              className="px-2 py-1 rounded-lg text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            >
              + {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
