'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Users,
  FileCheck2,
} from 'lucide-react';

export default function HomePage() {
  const { user, loading, isManager } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (isManager) {
        router.push('/dashboard');
      } else {
        router.push('/reports/new');
      }
    }
  }, [user, loading, isManager, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col text-slate-100">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-surface/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold text-lg">
            WR
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white">TeamSync Report</h1>
            <p className="text-[11px] text-slate-400">Weekly Report Generator &amp; Team Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
          >
            Sign In / Quick Demo &rarr;
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Full Stack Technical Assignment • Enterprise Engineering Stack</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
          Weekly Report Generator &amp; <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Team Dashboard</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          A structured, multi-role reporting platform connecting engineering team members with management.
          Standardized weekly reports, manager correction workflows, version audit history, and visual analytics.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25 transition flex items-center gap-2"
          >
            <span>Launch Live Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
          >
            Create Account
          </Link>
        </div>

        {/* Core Pillars Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-surface/80 border border-slate-800 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/50 flex items-center justify-center mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Fixed-Structure Reports</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Standardized weekly reports with task percentage tracking, deliverables, single key blocker flags, and time breakdown.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/80 border border-slate-800 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Review &amp; Correction Cycle</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Draft &rarr; Submit &rarr; Manager Request Changes &rarr; Resubmit &rarr; Approve. Complete version snapshot history preserved.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/80 border border-slate-800 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Executive Insights &amp; AI</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Data-driven dashboard with compliance rates, task completion velocity trends, workload distribution, and conversational AI assistant.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Built for Technical SE Assignment • Next.js + NestJS + PostgreSQL + Prisma
      </footer>
    </div>
  );
}
