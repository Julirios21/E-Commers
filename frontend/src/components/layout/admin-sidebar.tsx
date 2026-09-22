'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  CreditCard,
  Users,
  Store,
} from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/categories', label: 'Categorías', icon: FolderTree },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/payments', label: 'Pagos', icon: CreditCard },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-4 border-t border-gray-700 pt-4"
        >
          <Store className="h-5 w-5" />
          Volver a la tienda
        </Link>
      </nav>
    </aside>
  );
}
