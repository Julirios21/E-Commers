'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/components/features/product-card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Product[]>('/products'),
      api.get<Category[]>('/categories'),
    ]).then(([p, c]) => {
      setProducts(p.slice(0, 8));
      setCategories(c);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Los mejores productos</h1>
          <p className="text-lg text-indigo-100 mb-8">Encuentra todo lo que necesitas al mejor precio</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Ver productos <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">Envío rápido</h3>
              <p className="text-sm text-gray-500">Entrega en 24-48h</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">Compra segura</h3>
              <p className="text-sm text-gray-500">Pago 100% seguro</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">Soporte 24/7</h3>
              <p className="text-sm text-gray-500">Estamos para ayudarte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="bg-gray-50 rounded-lg p-6 text-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors border"
              >
                <span className="font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Últimos productos</h2>
          <Link href="/products" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
