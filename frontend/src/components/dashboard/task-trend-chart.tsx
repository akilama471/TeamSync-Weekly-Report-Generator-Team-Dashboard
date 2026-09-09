'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TaskTrend } from '../../types';

export const TaskTrendChart: React.FC<{ data: TaskTrend[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No trend records available yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stop-color="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stop-color="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="week" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
          />
          <Area
            type="monotone"
            dataKey="completedTasks"
            name="Tasks Completed"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#taskGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
