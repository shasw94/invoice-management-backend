import { Product } from 'src/product/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location: string;

  @OneToMany(() => Product, (product) => product.store, { eager: false })
  products: Product[];
}
