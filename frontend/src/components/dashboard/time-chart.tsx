'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TimeDistributionItem } from '../../types';

export const TimeChart: React.FC<{ data: TimeDistributionItem[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No time distribution logged this week.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="taskType" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
            formatter={(value: any) => [`${value} hrs`, 'Logged Hours']}
          />
          <Bar dataKey="hours" name="Hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
