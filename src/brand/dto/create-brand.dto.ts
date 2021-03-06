import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
