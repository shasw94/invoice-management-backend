import { Product } from "src/product/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    name: string;

    @Column({
        nullable: true,
    })
    description: string;

    @OneToMany(() => Product, product => product.brand, {eager: false})
    products: Product[] 
}