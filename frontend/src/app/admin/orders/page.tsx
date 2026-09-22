'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Order } from '@/types';
import { OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/ui/badges';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get<Order[]>('/orders').then(setOrders).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: OrderStatus) => {
    await api.patch(`/orders/${id}/status`, { status });
    load();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fecha</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Dirección</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Total</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Cambiar Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium">#{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3 text-sm max-w-[200px] truncate">{order.shipping_address}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 text-center"><OrderStatusBadge status={order.status} /></td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {Object.values(OrderStatus).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
