import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ReadRowOrderDto {
    
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    orderNumber: number;

    @IsNotEmpty()
    @IsString()
    product: string;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @IsNumber()
    rate: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    totalAmountPaid: number;

    @IsNotEmpty()
    @IsString()
    location: string;
}