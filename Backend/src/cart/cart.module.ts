import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity.js';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
