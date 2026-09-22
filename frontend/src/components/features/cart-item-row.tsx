'use client';

import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';

export function CartItemRow({ itemId, productName, price, quantity, imageUrl }: {
  itemId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">IMG</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{productName}</h4>
        <p className="text-sm text-gray-500">{formatPrice(price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(itemId, quantity - 1)}
          disabled={quantity <= 1}
          className="p-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button
          onClick={() => updateQuantity(itemId, quantity + 1)}
          className="p-1 rounded border hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <span className="font-medium text-gray-900 w-24 text-right">
        {formatPrice(price * quantity)}
      </span>

      <button
        onClick={() => removeItem(itemId)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
