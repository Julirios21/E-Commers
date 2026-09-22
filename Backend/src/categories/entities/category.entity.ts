import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 120 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany('Product', (product: any) => product.category)
  products: any[];
}
