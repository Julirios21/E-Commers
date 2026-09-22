import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productsRepository.create(dto);
    return this.productsRepository.save(product);
  }

  findAll(categoryId?: number, search?: string) {
    const where: any = { is_active: true };
    if (categoryId) {
      where.category_id = categoryId;
    }
    if (search) {
      where.name = ILike(`%${search}%`);
    }
    return this.productsRepository.find({ where });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}
