import { Brand } from 'src/brand/brand.entity';
import { Order } from 'src/order/order.entity';
import { OrderToProduct } from 'src/order/order.product.entity';
import { Store } from 'src/store/store.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rate: number;

  @ManyToMany(()=> Store, store => store.products, {cascade: true, eager: true})
  stores: Store[];

  @ManyToOne(() => Brand, (brand) => brand.products, { cascade: true, eager: true })
  brand: Brand;

  @OneToMany(() => OrderToProduct, orderToProduct => orderToProduct.product, {eager: false})
  orderToProduct: Product[];
}
