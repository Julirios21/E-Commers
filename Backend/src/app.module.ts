import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ProductsModule } from './products/products.module.js';
import { CartModule } from './cart/cart.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { User } from './users/entities/user.entity.js';
import { Category } from './categories/entities/category.entity.js';
import { Product } from './products/entities/product.entity.js';
import { CartItem } from './cart/entities/cart-item.entity.js';
import { Order } from './orders/entities/order.entity.js';
import { OrderItem } from './orders/entities/order-item.entity.js';
import { Payment } from './payments/entities/payment.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'ecommerce_user'),
        password: configService.get<string>('DB_PASS', 'ecommerce_pass'),
        database: configService.get<string>('DB_NAME', 'ecommerce'),
        entities: [
          User,
          Category,
          Product,
          CartItem,
          Order,
          OrderItem,
          Payment,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
  ],
})
export class AppModule {}
