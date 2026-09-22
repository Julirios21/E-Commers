'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { CartItemRow } from '@/components/features/cart-item-row';
import { PageSpinner } from '@/components/ui/spinner';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

export default function CartPage() {
  return <AuthGuard><CartContent /></AuthGuard>;
}

function CartContent() {
  const { items, total, itemCount, fetchCart, loading } = useCartStore() as any;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) return <PageSpinner />;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-6">Agrega productos para comenzar</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Ver productos <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Carrito ({itemCount} items)</h1>

      <div className="bg-white rounded-lg border p-6">
        {items.map((item: any) => (
          <CartItemRow
            key={item.id}
            itemId={item.id}
            productName={item.product.name}
            price={Number(item.product.price)}
            quantity={item.quantity}
            imageUrl={item.product.image_url}
          />
        ))}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-gray-500">Total:</span>
          <span className="text-2xl font-bold ml-2">{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Proceder al checkout
        </Link>
      </div>
    </div>
  );
}
