import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity.js';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { OrdersModule } from '../orders/orders.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
