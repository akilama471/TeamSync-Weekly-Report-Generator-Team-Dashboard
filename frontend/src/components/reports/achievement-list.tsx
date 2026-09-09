'use client';

import React from 'react';
import { ReportAchievement } from '../../types';
import { Trophy, Star, Plus, Trash2 } from 'lucide-react';

interface AchievementListProps {
  achievements: ReportAchievement[];
  onChange: (achievements: ReportAchievement[]) => void;
  readOnly?: boolean;
}

export const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  onChange,
  readOnly = false,
}) => {
  const addAchievement = () => {
    onChange([
      ...achievements,
      {
        description: '',
        isKeyAchievement: achievements.length === 0,
      },
    ]);
  };

  const updateAchievement = (index: number, description: string) => {
    const updated = [...achievements];
    updated[index] = {
      ...updated[index],
      description,
    };
    onChange(updated);
  };

  const setKeyAchievement = (index: number) => {
    // Only one can be key achievement
    const updated = achievements.map((a, i) => ({
      ...a,
      isKeyAchievement: i === index ? !a.isKeyAchievement : false,
    }));
    onChange(updated);
  };

  const removeAchievement = (index: number) => {
    onChange(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Achievements &amp; Highlights</span>
          </h3>
          <p className="text-xs text-slate-400">
            Record key wins. Flag one as the <span className="text-emerald-400 font-semibold">Key Achievement</span> of the week.
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={addAchievement}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Win</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {achievements.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No specific achievements added yet.
          </div>
        ) : (
          achievements.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                item.isKeyAchievement
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : 'bg-surface/80 border-slate-800'
              }`}
            >
              <div className="flex-1 w-full">
                {readOnly ? (
                  <p className="text-sm text-slate-200">{item.description}</p>
                ) : (
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateAchievement(idx, e.target.value)}
                    placeholder="Describe key achievement or milestone hit..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {readOnly ? (
                  item.isKeyAchievement && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      Key Achievement
                    </span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setKeyAchievement(idx)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                      item.isKeyAchievement
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-emerald-300 hover:border-emerald-600/40'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.isKeyAchievement ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                    <span>{item.isKeyAchievement ? 'Key Achievement' : 'Flag as Key'}</span>
                  </button>
                )}

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeAchievement(idx)}
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
