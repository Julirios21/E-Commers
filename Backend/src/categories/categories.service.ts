import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(dto);
    return this.categoriesRepository.save(category);
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Categoría #${id} no encontrada`);
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoriesRepository.remove(category);
  }
}
