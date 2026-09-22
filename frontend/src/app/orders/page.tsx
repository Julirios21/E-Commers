'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/ui/badges';
import { Spinner } from '@/components/ui/spinner';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Order[]>('/orders').then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No tienes pedidos</h1>
        <p className="text-gray-500 mb-6">Realiza tu primer pedido</p>
        <Link href="/products" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-gray-500">Pedido #{order.id}</span>
                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">{order.shipping_address}</span>
              <span className="font-bold">{formatPrice(order.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
