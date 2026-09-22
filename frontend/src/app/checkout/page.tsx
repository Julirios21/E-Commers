'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { PageSpinner } from '@/components/ui/spinner';
import { Package } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

export default function CheckoutPage() {
  return <AuthGuard><CheckoutContent /></AuthGuard>;
}

function CheckoutContent() {
  const router = useRouter();
  const { items, total, fetchCart } = useCartStore() as any;
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCart().finally(() => setFetching(false));
  }, [fetchCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    try {
      const order = await api.post<any>('/orders', { shipping_address: address });
      router.push(`/orders/${order.id}`);
    } catch (e: any) {
      alert(e.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PageSpinner />;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No hay items en el carrito</h1>
        <button onClick={() => router.push('/products')} className="text-indigo-600 hover:text-indigo-700 font-medium">
          Ir a productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Dirección de envío</h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            placeholder="Calle, número, ciudad, código postal..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          />
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando pedido...' : 'Confirmar Pedido'}
          </button>
        </form>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name} x{item.quantity}
                </span>
                <span className="font-medium">{formatPrice(Number(item.product.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
