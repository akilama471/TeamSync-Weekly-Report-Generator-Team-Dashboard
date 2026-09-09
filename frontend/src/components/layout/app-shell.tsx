'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { AiChatWidget } from '../ai/ai-chat-widget';

export const AppShell: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  requireManager?: boolean;
}> = ({ children, title, subtitle, requireManager = false }) => {
  const { user, loading, isManager } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && requireManager && !isManager) {
      router.push('/reports/new');
    }
  }, [loading, user, isManager, requireManager, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Authenticating &amp; Loading Workspace...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex text-slate-100 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
      {/* Floating AI Assistant for Managers & Admins (Assignment Bonus Requirement) */}
      {isManager && <AiChatWidget />}
    </div>
  );
};
