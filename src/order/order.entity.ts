import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @Column()
  orderNumber: number;

  @Column()
  quantity: number;

  @Column()
  totalAmountPaid: number;

  @ManyToMany(() => Product, (product) => product.orders, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  products: Product[];
}
