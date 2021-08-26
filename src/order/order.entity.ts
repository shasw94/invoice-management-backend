import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: string;

    @Column()
    number: number;

    
}