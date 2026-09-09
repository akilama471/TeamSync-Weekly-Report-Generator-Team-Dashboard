'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import {
  LayoutDashboard,
  FileEdit,
  History,
  FolderKanban,
  Users,
  Sparkles,
  LogOut,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isManager, isAdmin, logout, quickLoginAs } = useAuth();

  const navItems = [
    // Manager & Admin Links
    ...(isManager
      ? [
          {
            label: 'Team Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            badge: 'Manager',
          },
        ]
      : []),

    // Team Member & Manager Report Links
    {
      label: 'Submit Weekly Report',
      href: '/reports/new',
      icon: FileEdit,
    },
    {
      label: 'My Report History',
      href: '/reports/history',
      icon: History,
    },

    // Manager Project Management
    ...(isManager
      ? [
          {
            label: 'Project Management',
            href: '/manager/projects',
            icon: FolderKanban,
          },
        ]
      : []),

    // Admin User Management
    ...(isAdmin
      ? [
          {
            label: 'User Management',
            href: '/admin/users',
            icon: Users,
            badge: 'Admin',
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-surface border-r border-slate-800 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold text-lg">
          WR
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-white leading-tight">TeamSync Report</h1>
          <p className="text-xs text-slate-400">Weekly Pulse &amp; Review</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Demo Fast Role Switcher Box for Video Presentation */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 px-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Role Switcher</span>
          </div>
          <div className="space-y-1 text-xs">
            <button
              onClick={() => quickLoginAs('manager@company.com')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition ${
                user?.email === 'manager@company.com' ? 'bg-indigo-950 text-indigo-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>Sarah (Manager)</span>
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            </button>
            <button
              onClick={() => quickLoginAs('akila@company.com')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition ${
                user?.email === 'akila@company.com' ? 'bg-emerald-950 text-emerald-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>Akila (Member - Submitted)</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => quickLoginAs('kasun@company.com')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition ${
                user?.email === 'kasun@company.com' ? 'bg-rose-950 text-rose-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>Kasun (Needs Correction)</span>
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            </button>
            <button
              onClick={() => quickLoginAs('nimal@company.com')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition ${
                user?.email === 'nimal@company.com' ? 'bg-slate-700 text-slate-200 font-semibold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>Nimal (Draft Report)</span>
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 bg-surface/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-200">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Guest'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.role?.name || 'Loading...'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
