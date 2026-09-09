'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth-context';
import { api } from '../../lib/api';
import { Lock, Mail, User as UserIcon, ArrowRight, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [roleId, setRoleId] = useState(1); // 1 = TEAM_MEMBER, 2 = MANAGER, 3 = ADMIN
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.register({
        name,
        email,
        password,
        department,
        jobTitle,
        roleId: Number(roleId),
      });
      // Auto login after registration
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl font-bold text-xl mx-auto mb-3">
          WR
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Workspace Account</h2>
        <p className="text-xs text-slate-400 mt-1">Register as a Team Member or Manager</p>
      </div>

      <div className="w-full max-w-md p-6 rounded-2xl bg-surface/90 border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. maya@company.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">System Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={1}>Team Member (Can submit &amp; edit reports)</option>
              <option value={2}>Manager (Can review, approve &amp; access dashboard)</option>
              <option value={3}>Admin (Full user &amp; project management)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 mt-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
