import { Product } from 'src/product/product.entity';
import { Store } from 'src/store/store.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderToProduct } from './order.product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column({
    unique: true,
  })
  orderNumber: number;


  @OneToMany(() => OrderToProduct, orderToProduct => orderToProduct.order, {eager: true})
  orderToProduct: OrderToProduct[];

}
