'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { PageSpinner } from '@/components/ui/spinner';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    api.get<Product>(`/products/${params.id}`)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setAdding(true);
    await addItem(product!.id, quantity);
    setAdding(false);
  };

  if (loading) return <PageSpinner />;
  if (!product) return <div className="text-center py-12">Producto no encontrado</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-gray-400 text-lg">Sin imagen</span>
          )}
        </div>

        <div>
          <p className="text-sm text-indigo-600 mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="text-gray-600 mb-6">{product.description}</p>
          )}

          <div className="mb-6">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium">Cantidad:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-lg px-3 py-2"
              >
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            {adding ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
