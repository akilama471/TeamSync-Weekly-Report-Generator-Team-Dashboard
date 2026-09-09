import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'indigo',
}) => {
  const colors = {
    indigo: {
      bg: 'from-indigo-600/10 to-indigo-950/20 border-indigo-500/30',
      iconBg: 'bg-indigo-600/20 text-indigo-400',
    },
    emerald: {
      bg: 'from-emerald-600/10 to-emerald-950/20 border-emerald-500/30',
      iconBg: 'bg-emerald-600/20 text-emerald-400',
    },
    amber: {
      bg: 'from-amber-600/10 to-amber-950/20 border-amber-500/30',
      iconBg: 'bg-amber-600/20 text-amber-400',
    },
    rose: {
      bg: 'from-rose-600/10 to-rose-950/20 border-rose-500/30',
      iconBg: 'bg-rose-600/20 text-rose-400',
    },
    cyan: {
      bg: 'from-cyan-600/10 to-cyan-950/20 border-cyan-500/30',
      iconBg: 'bg-cyan-600/20 text-cyan-400',
    },
  }[colorScheme];

  return (
    <div
      className={`p-5 rounded-2xl bg-gradient-to-br ${colors.bg} border backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors.iconBg} shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </div>
  );
};
