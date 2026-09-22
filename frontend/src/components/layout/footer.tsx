import Link from 'next/link';
import { Store } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-indigo-400" />
            <span className="font-bold text-white">E-Shop</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/products" className="hover:text-white transition-colors">Productos</Link>
            <Link href="/cart" className="hover:text-white transition-colors">Carrito</Link>
            <Link href="/orders" className="hover:text-white transition-colors">Mis Pedidos</Link>
          </div>
          <p className="text-sm text-gray-500">&copy; 2026 E-Shop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
