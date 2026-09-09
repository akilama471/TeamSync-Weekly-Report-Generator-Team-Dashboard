'use client';

import React from 'react';
import { ReportBlocker } from '../../types';
import { AlertOctagon, Star, Plus, Trash2 } from 'lucide-react';

interface BlockerListProps {
  blockers: ReportBlocker[];
  onChange: (blockers: ReportBlocker[]) => void;
  readOnly?: boolean;
}

export const BlockerList: React.FC<BlockerListProps> = ({ blockers, onChange, readOnly = false }) => {
  const addBlocker = () => {
    onChange([
      ...blockers,
      {
        description: '',
        impact: 'Medium',
        isKeyIssue: blockers.length === 0, // default first one to key issue if none selected
      },
    ]);
  };

  const updateBlocker = (index: number, field: keyof ReportBlocker, value: any) => {
    const updated = [...blockers];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const setKeyIssue = (index: number) => {
    // Only one blocker can be marked as key issue
    const updated = blockers.map((b, i) => ({
      ...b,
      isKeyIssue: i === index ? !b.isKeyIssue : false,
    }));
    onChange(updated);
  };

  const removeBlocker = (index: number) => {
    onChange(blockers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Blockers &amp; Challenges</span>
          </h3>
          <p className="text-xs text-slate-400">
            Record issues encountered. Flag up to one item as the <span className="text-amber-400 font-semibold">Key Issue</span> for the week.
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={addBlocker}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Blocker</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {blockers.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No blockers or impediments recorded this week. Smooth sailing!
          </div>
        ) : (
          blockers.map((blocker, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                blocker.isKeyIssue
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-sm'
                  : 'bg-surface/80 border-slate-800'
              }`}
            >
              <div className="flex-1 w-full">
                {readOnly ? (
                  <p className="text-sm text-slate-200">{blocker.description}</p>
                ) : (
                  <input
                    type="text"
                    value={blocker.description}
                    onChange={(e) => updateBlocker(idx, 'description', e.target.value)}
                    placeholder="Describe the challenge or blocker..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {/* Key Issue Toggle */}
                {readOnly ? (
                  blocker.isKeyIssue && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/40">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Key Issue
                    </span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setKeyIssue(idx)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                      blocker.isKeyIssue
                        ? 'bg-amber-950 text-amber-300 border-amber-500/60 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-amber-300 hover:border-amber-600/40'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${blocker.isKeyIssue ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{blocker.isKeyIssue ? 'Key Issue' : 'Flag as Key'}</span>
                  </button>
                )}

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeBlocker(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
