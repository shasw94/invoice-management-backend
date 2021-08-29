import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  location: string;

  @ManyToMany(() => Product, (product) => product.stores, { eager: false })
  @JoinTable()
  products: Product[];

}
