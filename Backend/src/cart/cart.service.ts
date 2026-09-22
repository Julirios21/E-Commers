import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { ProductsService } from '../products/products.service.js';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async addItem(userId: number, dto: AddToCartDto) {
    const product = await this.productsService.findOne(dto.product_id);

    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${product.stock}`,
      );
    }

    const existing = await this.cartRepository.findOne({
      where: { user_id: userId, product_id: dto.product_id },
    });

    if (existing) {
      const newQty = existing.quantity + dto.quantity;
      if (newQty > product.stock) {
        throw new BadRequestException(
          `Stock insuficiente. Disponible: ${product.stock}`,
        );
      }
      existing.quantity = newQty;
      return this.cartRepository.save(existing);
    }

    const item = this.cartRepository.create({
      user_id: userId,
      product_id: dto.product_id,
      quantity: dto.quantity,
    });
    return this.cartRepository.save(item);
  }

  async getCart(userId: number) {
    const items = await this.cartRepository.find({
      where: { user_id: userId },
      relations: { product: true },
    });

    const total = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    return { items, total };
  }

  async updateItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const item = await this.cartRepository.findOne({
      where: { id: itemId, user_id: userId },
      relations: { product: true },
    });
    if (!item) {
      throw new NotFoundException('Item del carrito no encontrado');
    }

    if (dto.quantity > item.product.stock) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${item.product.stock}`,
      );
    }

    item.quantity = dto.quantity;
    return this.cartRepository.save(item);
  }

  async removeItem(userId: number, itemId: number) {
    const item = await this.cartRepository.findOne({
      where: { id: itemId, user_id: userId },
    });
    if (!item) {
      throw new NotFoundException('Item del carrito no encontrado');
    }
    return this.cartRepository.remove(item);
  }

  async clearCart(userId: number) {
    const items = await this.cartRepository.find({
      where: { user_id: userId },
    });
    return this.cartRepository.remove(items);
  }
}
