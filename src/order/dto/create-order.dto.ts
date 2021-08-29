import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNumber()
  @IsPositive()
  @IsInt()
  orderNumber: number;

}

export class CreateOrderToProductDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalAmountPaid: number;

  @IsString()
  @IsNotEmpty()
  location: string
}
