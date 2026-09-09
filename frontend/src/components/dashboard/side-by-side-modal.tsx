'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { X, Star, AlertOctagon, Trophy } from 'lucide-react';
import { StatusBadge } from '../ui/status-badge';

interface SideBySideModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekStart: string;
}

export const SideBySideModal: React.FC<SideBySideModalProps> = ({
  isOpen,
  onClose,
  weekStart,
}) => {
  const [section, setSection] = useState<'blockers' | 'achievements'>('blockers');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.getSideBySide(section, weekStart);
        setData(res);
      } catch (err) {
        console.error('Failed to load side by side view:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, section, weekStart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Team-Wide Comparison (Side-by-Side)</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Bonus Feature
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review all team members&apos; highlights or blockers in a consolidated multi-column view.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-3">
          <button
            onClick={() => setSection('blockers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              section === 'blockers'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Blockers &amp; Challenges</span>
          </button>

          <button
            onClick={() => setSection('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              section === 'achievements'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievements &amp; Highlights</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading side-by-side data...</div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              No records submitted yet for this week.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((col) => (
                <div
                  key={col.reportId}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-300">
                          {col.user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-white">{col.user.name}</span>
                      </div>
                      <StatusBadge status={col.status} size="sm" />
                    </div>

                    <div className="space-y-2">
                      {col.items && col.items.length > 0 ? (
                        col.items.map((item: any, idx: number) => {
                          const isFlagged = item.isKeyIssue || item.isKeyAchievement;
                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-lg text-xs ${
                                isFlagged
                                  ? section === 'blockers'
                                    ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
                                    : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                                  : 'bg-slate-950/40 border border-slate-800/70 text-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <p className="leading-relaxed">{item.description}</p>
                                {isFlagged && (
                                  <Star
                                    className={`w-3 h-3 flex-shrink-0 mt-0.5 ${
                                      section === 'blockers'
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-emerald-400 text-emerald-400'
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic">None reported for this period.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
