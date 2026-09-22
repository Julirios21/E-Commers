'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';
import { UserRole } from '@/types';
import { formatDate } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get<User[]>('/users').then(setUsers).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateRole = async (id: number, role: UserRole) => {
    await api.put(`/users/${id}`, { role });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Usuarios</h1>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Nombre</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Rol</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Registro</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium">#{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {Object.values(UserRole).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
