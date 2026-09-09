'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { api } from '@/lib/api';
import { User, Role } from '@/types';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Trash2,
  Mail,
  Briefcase,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.getUsers(),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/roles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        }).then((r) => r.json()),
      ]);
      setUsers(usersRes);
      setRoles(rolesRes);
    } catch (err) {
      console.error('Failed to load user management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId: number, newRoleId: number) => {
    try {
      await api.updateUser(userId, { roleId: newRoleId });
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to remove user "${user.name}"?`)) return;
    try {
      await api.deleteUser(user.id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove user');
    }
  };

  return (
    <AppShell
      title="System User &amp; Role Management"
      subtitle="Admin control center for role-based access control, account permissions, and team members"
      requireManager={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/90 border border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Registered Accounts &amp; Role Assignment</span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure access privileges: Team Member, Manager, or Admin.
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/90 shadow-xl">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Department &amp; Title</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-xs text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center font-bold text-xs text-white">
                          {u.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      <span>{u.jobTitle || 'Engineer'}</span>
                      <span className="text-slate-500 block text-[11px]">
                        {u.department || 'Engineering'}
                      </span>
                    </td>

                    {/* Role Dropdown */}
                    <td className="p-4">
                      <select
                        value={u.roleId}
                        onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                        title="Remove user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
