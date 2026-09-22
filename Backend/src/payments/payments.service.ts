import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { OrdersService } from '../orders/orders.service.js';
import { OrderStatus } from '../orders/entities/order.entity.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly ordersService: OrdersService,
  ) {}

  async create(userId: number, dto: CreatePaymentDto) {
    const order = await this.ordersService.findOne(userId, dto.order_id);

    const payment = this.paymentsRepository.create({
      order_id: dto.order_id,
      method: dto.method,
      amount: dto.amount,
      reference: dto.reference,
      status: PaymentStatus.PENDING,
    });

    const saved = await this.paymentsRepository.save(payment);

    await this.ordersService.updateStatus(order.id, OrderStatus.PROCESSING);

    return saved;
  }

  async complete(paymentId: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException(`Pago #${paymentId} no encontrado`);
    }
    payment.status = PaymentStatus.COMPLETED;
    return this.paymentsRepository.save(payment);
  }

  findAll() {
    return this.paymentsRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  findByOrder(orderId: number) {
    return this.paymentsRepository.find({
      where: { order_id: orderId },
      order: { created_at: 'DESC' },
    });
  }
}
