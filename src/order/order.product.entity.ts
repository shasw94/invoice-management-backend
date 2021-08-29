import { Product } from 'src/product/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderToProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  orderId: number;

  @Column()
  quantity: number;

  @Column()
  totalAmountPaid: number;

  @Column()
  location: string;

  @ManyToOne(() => Order, (order) => order.orderToProduct)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderToProduct, {
    eager: true,
  })
  product: Product;
}
