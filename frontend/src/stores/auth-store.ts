'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: async (email, password) => {
        const res = await api.post<{ user: User; access_token: string }>('/auth/login', { email, password });
        document.cookie = `token=${res.access_token};path=/;max-age=86400`;
        set({
          user: res.user,
          token: res.access_token,
          isAuthenticated: true,
          isAdmin: res.user.role === 'admin',
        });
      },

      register: async (name, email, password) => {
        const res = await api.post<{ user: User; access_token: string }>('/auth/register', { name, email, password });
        document.cookie = `token=${res.access_token};path=/;max-age=86400`;
        set({
          user: res.user,
          token: res.access_token,
          isAuthenticated: true,
          isAdmin: res.user.role === 'admin',
        });
      },

      logout: () => {
        document.cookie = 'token=;path=/;max-age=0';
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
      },

      loadProfile: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const user = await api.get<User>('/auth/profile');
          set({ user, isAuthenticated: true, isAdmin: user.role === 'admin' });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState as Partial<AuthState>) };
        merged.isAuthenticated = !!merged.token;
        merged.isAdmin = merged.user?.role === 'admin';
        return merged;
      },
    },
  ),
);
