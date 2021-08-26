import { Product } from "src/product/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Product, product => product.brand, {eager: true})
    products: Product[] 
}