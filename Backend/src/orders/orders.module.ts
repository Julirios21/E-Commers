import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { Payment } from '../payments/entities/payment.entity.js';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { CartModule } from '../cart/cart.module.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Payment]),
    CartModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
