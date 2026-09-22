'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';
import { formatPrice, slugify } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', stock: '', category_id: '', is_active: true });

  const load = () => {
    api.get<Product[]>('/products').then(setProducts);
    api.get<Category[]>('/categories').then(setCategories);
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: Number(form.category_id),
      is_active: form.is_active,
    };
    if (editingId) {
      await api.put(`/products/${editingId}`, body);
    } else {
      await api.post('/products', body);
    }
    resetForm();
    load();
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, slug: p.slug, description: p.description || '',
      price: String(p.price), stock: String(p.stock),
      category_id: String(p.category_id), is_active: p.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', price: '', stock: '', category_id: '', is_active: true });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="h-4 w-4" /> {showForm ? 'Cancelar' : 'Nuevo producto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="auto-generado" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required className="w-full px-3 py-2 border rounded-lg">
                <option value="">Seleccionar...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
                <span className="text-sm font-medium">Activo</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Nombre</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Categoría</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Precio</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Stock</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Activo</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-center">{p.is_active ? '✅' : '❌'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-700"><Pencil className="h-4 w-4 inline" /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
