'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Payment } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { PaymentStatusBadge } from '@/components/ui/badges';
import { CheckCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get<Payment[]>('/payments').then(setPayments).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const completePayment = async (id: number) => {
    await api.patch(`/payments/${id}/complete`, {});
    load();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pagos</h1>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Orden</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Método</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Monto</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Referencia</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fecha</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-500">No hay pagos registrados</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">#{p.id}</td>
                  <td className="px-4 py-3">#{p.order_id}</td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(p.amount)}</td>
                  <td className="px-4 py-3 text-center"><PaymentStatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.reference || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    {p.status === 'pending' && (
                      <button
                        onClick={() => completePayment(p.id)}
                        className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1 mx-auto"
                      >
                        <CheckCircle className="h-4 w-4" /> Completar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
