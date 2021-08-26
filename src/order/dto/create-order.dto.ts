import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNumber()
  @IsPositive()
  @IsInt()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsInt()
  orderNumber: number;

  @IsNotEmpty()
  @IsPositive()
  totalAmountPaid: number;
}
