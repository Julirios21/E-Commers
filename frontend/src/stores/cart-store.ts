'use client';

import { create } from 'zustand';
import type { CartItem, CartResponse } from '@/types';
import { api } from '@/lib/api';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  fetchCart: async () => {
    try {
      const res = await api.get<CartResponse>('/cart');
      set({
        items: res.items,
        total: res.total,
        itemCount: res.items.reduce((sum, item) => sum + item.quantity, 0),
      });
    } catch {
      set({ items: [], total: 0, itemCount: 0 });
    }
  },

  addItem: async (productId, quantity) => {
    await api.post('/cart', { product_id: productId, quantity });
    await get().fetchCart();
  },

  updateQuantity: async (itemId, quantity) => {
    await api.patch(`/cart/${itemId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [], total: 0, itemCount: 0 });
  },
}));
