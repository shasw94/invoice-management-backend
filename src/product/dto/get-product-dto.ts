import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetProductFilterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    rate?: number;

    @IsOptional()
    @IsString()
    search?: string;
}