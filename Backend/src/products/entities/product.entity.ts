import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ unique: true, length: 220 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'image_url', nullable: true })
  image_url: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @Column({ name: 'category_id' })
  category_id: number;

  @ManyToOne('Category', (category: any) => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
