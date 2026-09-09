'use client';

import React from 'react';
import { useAuth } from '../../context/auth-context';
import { Bell, Calendar, Sparkles } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export const Navbar: React.FC<{ title?: string; subtitle?: string }> = ({
  title = 'Weekly Report Generator & Team Dashboard',
  subtitle,
}) => {
  const { user } = useAuth();
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <header className="h-16 border-b border-slate-800 bg-surface/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Active Work Week Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            Active Week: {format(currentWeekStart, 'MMM dd')} - {format(currentWeekEnd, 'MMM dd, yyyy')}
          </span>
        </div>

        {/* User Role Badge */}
        {user?.role && (
          <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/40">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5"></span>
            {user.role.name}
          </span>
        )}
      </div>
    </header>
  );
};
