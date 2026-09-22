'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart, User, LogOut, LayoutDashboard, Store } from 'lucide-react';
import { useEffect } from 'react';

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  if (isAdmin) return null;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Store className="h-6 w-6" />
            E-Shop
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Productos
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Mis Pedidos
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  <User className="h-4 w-4 inline mr-1" />
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
