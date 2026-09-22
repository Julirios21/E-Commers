import { OrderStatus, PaymentStatus } from '@/types';

const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  completed: 'Completado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderStatusColors[status]}`}>
      {orderStatusLabels[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[status]}`}>
      {paymentStatusLabels[status]}
    </span>
  );
}
