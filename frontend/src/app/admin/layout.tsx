'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { PageSpinner } from '@/components/ui/spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated) {
    return <PageSpinner />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
