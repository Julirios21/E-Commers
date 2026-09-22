'use client';

import Link from 'next/link';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    await addItem(product.id, 1);
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
        <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="h-12 w-12" />
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-indigo-600 mb-1">{product.category?.name}</p>
          <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-orange-500 mt-1">Últimas {product.stock} unidades</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-500 mt-1">Agotado</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" x2="12" y1="22.08" y2="12" />
    </svg>
  );
}
