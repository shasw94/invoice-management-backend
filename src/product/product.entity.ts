import { Brand } from 'src/brand/brand.entity';
import { Order } from 'src/order/order.entity';
import { Store } from 'src/store/store.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  rate: number;

  @ManyToOne(()=> Store, store => store.products, {eager: true})
  store: Store;

  @ManyToOne(() => Brand, (brand) => brand.products, { eager: false })
  brand: Brand;

  @ManyToMany(() => Order, (order) => order.products, {eager: false})
  orders: Order[];
}
