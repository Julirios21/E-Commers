'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { User, Product, Order } from '@/types';
import { Package, Users, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    Promise.all([
      api.get<User[]>('/users').catch(() => []),
      api.get<Product[]>('/products').catch(() => []),
      api.get<Order[]>('/orders').catch(() => []),
    ]).then(([users, products, orders]) => {
      setStats({ users: users.length, products: products.length, orders: orders.length });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Usuarios</p>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Productos</p>
            <p className="text-3xl font-bold">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pedidos</p>
            <p className="text-3xl font-bold">{stats.orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
