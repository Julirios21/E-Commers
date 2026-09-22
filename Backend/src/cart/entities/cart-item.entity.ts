import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('cart_items')
@Unique(['user_id', 'product_id'])
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne('User', (user: any) => user.cartItems, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Product', { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: any;

  @CreateDateColumn()
  created_at: Date;
}
