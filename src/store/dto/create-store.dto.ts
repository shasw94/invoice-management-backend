import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsOptional()
  name: string;

  @IsNotEmpty()
  location: string;
}
