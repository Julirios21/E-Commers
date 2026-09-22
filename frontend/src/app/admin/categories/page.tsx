'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Category } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { slugify } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const load = () => api.get<Category[]>('/categories').then(setCategories);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { name, slug: slug || slugify(name), description: description || undefined };
    if (editingId) {
      await api.put(`/categories/${editingId}`, body);
    } else {
      await api.post('/categories', body);
    }
    resetForm();
    load();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> {showForm ? 'Cancelar' : 'Nueva categoría'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="auto-generado" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Nombre</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Slug</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:text-indigo-700"><Pencil className="h-4 w-4 inline" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
