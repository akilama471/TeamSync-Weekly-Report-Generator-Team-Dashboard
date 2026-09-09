'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth-context';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  FileEdit,
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickLoginAs, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async (demoEmail: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await quickLoginAs(demoEmail);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 font-bold text-xl mx-auto mb-3">
          WR
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">TeamSync Workspace</h2>
        <p className="text-xs text-slate-400 mt-1">Sign in to manage reports or access team analytics</p>
      </div>

      <div className="w-full max-w-md space-y-5">
        {/* Fast Demo Accounts Showcase (Crucial for Video & Evaluators) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Demo Accounts (1-Click Login)
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoClick('manager@company.com')}
              disabled={submitting}
              className="p-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-700/50 flex flex-col items-start transition text-left"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs">Sarah</span>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-[10px] text-indigo-400">Engineering Manager</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('akila@company.com')}
              disabled={submitting}
              className="p-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-700/50 flex flex-col items-start transition text-left"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs">Akila</span>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-emerald-400">Member (Submitted)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('kasun@company.com')}
              disabled={submitting}
              className="p-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 border border-rose-700/50 flex flex-col items-start transition text-left"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs">Kasun</span>
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <span className="text-[10px] text-rose-400">Needs Correction</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('nimal@company.com')}
              disabled={submitting}
              className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex flex-col items-start transition text-left"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs">Nimal</span>
                <FileEdit className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400">Draft Report State</span>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. manager@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
