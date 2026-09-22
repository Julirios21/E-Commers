import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  order_id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unit_price: number;

  @ManyToOne('Order', (order: any) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: any;

  @ManyToOne('Product', { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: any;
}
