'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/ui/badges';
import { PageSpinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Order>(`/orders/${params.id}`).then(setOrder).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <PageSpinner />;
  if (!order) return <div className="text-center py-12">Pedido no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/orders" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver a mis pedidos
      </Link>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
            <p className="text-gray-500">{formatDate(order.created_at)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-1">Dirección de envío</h2>
          <p className="text-gray-600">{order.shipping_address}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-3">Items</h2>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{item.product?.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">{formatPrice(Number(item.unit_price) * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
