'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../types';
import { api } from '../lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  quickLoginAs: (email: string) => Promise<void>;
  logout: () => void;
  isManager: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const profile = await api.getMe();
          setUser(profile);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        api.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password = 'password123') => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      if (res.user.role.name === 'TEAM_MEMBER') {
        router.push('/reports/new');
      } else {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLoginAs = async (email: string) => {
    await login(email, 'password123');
  };

  const logout = () => {
    api.logout();
    setUser(null);
    router.push('/login');
  };

  const roleName = user?.role?.name;
  const isManager = roleName === 'MANAGER' || roleName === 'ADMIN';
  const isAdmin = roleName === 'ADMIN';
  const isMember = roleName === 'TEAM_MEMBER';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        quickLoginAs,
        logout,
        isManager,
        isAdmin,
        isMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
