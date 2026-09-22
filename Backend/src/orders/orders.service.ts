import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { CartService } from '../cart/cart.service.js';
import { ProductsService } from '../products/products.service.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  async create(userId: number, dto: CreateOrderDto) {
    const { items, total } = await this.cartService.getCart(userId);

    if (items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    for (const item of items) {
      const product = await this.productsService.findOne(item.product_id);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`,
        );
      }
    }

    const order = this.ordersRepository.create({
      user_id: userId,
      total,
      shipping_address: dto.shipping_address,
      status: OrderStatus.PENDING,
    });
    const savedOrder = await this.ordersRepository.save(order);

    for (const item of items) {
      const orderItem = this.orderItemsRepository.create({
        order_id: savedOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(item.product.price),
      });
      await this.orderItemsRepository.save(orderItem);

      const product = await this.productsService.findOne(item.product_id);
      product.stock -= item.quantity;
      await this.productsService.update(product.id, { stock: product.stock });
    }

    const payment = this.paymentsRepository.create({
      order_id: savedOrder.id,
      method: dto.payment_method || 'pending',
      amount: total,
      status: PaymentStatus.PENDING,
    });
    await this.paymentsRepository.save(payment);

    await this.cartService.clearCart(userId);

    return this.findOne(userId, savedOrder.id);
  }

  findAll(userId: number, role?: string) {
    if (role === 'admin') {
      return this.ordersRepository.find({
        order: { created_at: 'DESC' },
      });
    }
    return this.ordersRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(userId: number, orderId: number) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: { items: { product: true } },
    });
    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} no encontrado`);
    }
    return order;
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} no encontrado`);
    }
    order.status = status;
    return this.ordersRepository.save(order);
  }
}
